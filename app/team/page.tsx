// app/team/page.tsx
// Updated with email integration

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [invitations, setInvitations] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [sending, setSending] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    email: '',
    propertyId: '',
    role: 'member'
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUserAndFetchData()
  }, [])

  async function checkUserAndFetchData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Fetch properties first
    const { data: propertiesData } = await supabase
      .from('properties')
      .select('id, name')
      .order('name')

    setProperties(propertiesData || [])

    // Fetch team members
    const { data: membersData } = await supabase
      .from('team_members')
      .select(`
        *,
        profiles (
          full_name,
          email
        ),
        properties (
          name
        )
      `)
      .order('created_at', { ascending: false })

    setTeamMembers(membersData || [])

    // Fetch pending invitations
    const { data: invitationsData } = await supabase
      .from('team_invitations')
      .select(`
        *,
        properties (
          name
        )
      `)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    setInvitations(invitationsData || [])
    setLoading(false)
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      // Generate unique token
      const token = crypto.randomUUID()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

      // Create invitation in database
      const { data: invitation, error: inviteError } = await supabase
        .from('team_invitations')
        .insert({
          property_id: inviteForm.propertyId,
          email: inviteForm.email,
          role: inviteForm.role,
          invited_by: user.id,
          token: token,
          expires_at: expiresAt.toISOString()
        })
        .select(`
          *,
          properties (
            name
          )
        `)
        .single()

      if (inviteError) throw inviteError

      // Get inviter's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      // Send invitation email via API route
      const emailResponse = await fetch('/api/send-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: inviteForm.email,
          propertyName: invitation.properties.name,
          inviterName: profile?.full_name || user.email?.split('@')[0] || 'Team Member',
          inviterEmail: user.email || '',
          role: inviteForm.role,
          token: token
        })
      })

      if (!emailResponse.ok) {
        throw new Error('Failed to send email')
      }

      // Success
      setInvitations([invitation, ...invitations])
      setInviteForm({ email: '', propertyId: '', role: 'member' })
      setShowInviteForm(false)
      alert('Invitation sent successfully!')

    } catch (error: any) {
      console.error('Error sending invitation:', error)
      alert('Error sending invitation. The invitation was created but email may not have been sent.')
    } finally {
      setSending(false)
    }
  }

  async function cancelInvitation(invitationId: string) {
    if (!confirm('Are you sure you want to cancel this invitation?')) return

    const { error } = await supabase
      .from('team_invitations')
      .delete()
      .eq('id', invitationId)

    if (error) {
      alert('Error canceling invitation: ' + error.message)
    } else {
      setInvitations(invitations.filter(inv => inv.id !== invitationId))
    }
  }

  async function removeMember(memberId: string) {
    if (!confirm('Are you sure you want to remove this team member?')) return

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId)

    if (error) {
      alert('Error removing team member: ' + error.message)
    } else {
      setTeamMembers(teamMembers.filter(member => member.id !== memberId))
    }
  }

  async function updateRole(memberId: string, newRole: string) {
    const { error } = await supabase
      .from('team_members')
      .update({ role: newRole })
      .eq('id', memberId)

    if (error) {
      alert('Error updating role: ' + error.message)
    } else {
      setTeamMembers(teamMembers.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      ))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
              <p className="text-gray-600 mt-1">Manage team members and permissions</p>
            </div>
            <button
              onClick={() => setShowInviteForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Invite Team Member
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Invite Form Modal */}
        {showInviteForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Invite Team Member</h2>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="team@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property
                  </label>
                  <select
                    required
                    value={inviteForm.propertyId}
                    onChange={(e) => setInviteForm({ ...inviteForm, propertyId: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select a property...</option>
                    {properties.map(property => (
                      <option key={property.id} value={property.id}>
                        {property.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="viewer">Viewer (Read only)</option>
                    <option value="member">Member (Can edit)</option>
                    <option value="admin">Admin (Full access)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInviteForm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send Invitation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Invitations</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expires
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invitations.map((invitation) => (
                    <tr key={invitation.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invitation.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invitation.properties?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {invitation.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invitation.expires_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => cancelInvitation(invitation.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Team Members */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h2>
          {teamMembers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
              <p className="text-gray-500 mb-4">
                Invite team members to collaborate on your properties
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.profiles?.full_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.profiles?.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.properties?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          value={member.role}
                          onChange={(e) => updateRole(member.id, e.target.value)}
                          className="text-sm border-gray-300 rounded-md"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => removeMember(member.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">📧 Email Configuration Required</h3>
          <p className="text-blue-800 mb-2">
            To send invitation emails, you need to:
          </p>
          <ol className="list-decimal list-inside text-blue-800 space-y-1">
            <li>Sign up for a free Resend account at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="underline">resend.com</a></li>
            <li>Get your API key from the Resend dashboard</li>
            <li>Add <code className="bg-blue-100 px-2 py-1 rounded">RESEND_API_KEY=your-key-here</code> to your environment variables</li>
            <li>Create an API route at <code className="bg-blue-100 px-2 py-1 rounded">/api/send-invite</code> to handle email sending</li>
          </ol>
          <p className="text-blue-800 mt-2">
            Currently, invitations are created in the database but emails are not sent.
          </p>
        </div>
      </div>
    </div>
  )
}
