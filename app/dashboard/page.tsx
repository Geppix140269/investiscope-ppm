// app/dashboard/page.tsx
// Enhanced Dashboard with Analytics - FIXED ESLINT ERROR

'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const checkUserAndFetchData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      setUser(user)
      
      // Fetch all data in parallel
      const [propertiesData, projectsData, tasksData, documentsData] = await Promise.all([
        supabase.from('properties').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('tasks').select('*'),
        supabase.from('documents').select('*')
      ])

      setProperties(propertiesData.data || [])
      setProjects(projectsData.data || [])
      setTasks(tasksData.data || [])
      setDocuments(documentsData.data || [])
    } catch (error) {
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }, [router, supabase])

  useEffect(() => {
    checkUserAndFetchData()
  }, [checkUserAndFetchData])

  // Calculate statistics
  const stats = {
    totalProperties: properties.length,
    totalInvestment: properties.reduce((sum, p) => sum + (p.purchase_price || 0), 0),
    currentValue: properties.reduce((sum, p) => sum + (p.current_value || p.purchase_price || 0), 0),
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    totalDocuments: documents.length
  }

  const totalROI = stats.totalInvestment > 0 
    ? ((stats.currentValue - stats.totalInvestment) / stats.totalInvestment * 100).toFixed(1)
    : '0'

  // Prepare chart data
  const projectStatusData = [
    { name: 'Planning', value: projects.filter(p => p.status === 'planning').length, color: '#FCD34D' },
    { name: 'Active', value: projects.filter(p => p.status === 'active').length, color: '#3B82F6' },
    { name: 'On Hold', value: projects.filter(p => p.status === 'on_hold').length, color: '#9CA3AF' },
    { name: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: '#10B981' }
  ]

  const propertyTypeData = [
    { name: 'Apartment', value: properties.filter(p => p.property_type === 'apartment').length },
    { name: 'House', value: properties.filter(p => p.property_type === 'house').length },
    { name: 'Commercial', value: properties.filter(p => p.property_type === 'commercial').length },
    { name: 'Land', value: properties.filter(p => p.property_type === 'land').length },
    { name: 'Other', value: properties.filter(p => !['apartment', 'house', 'commercial', 'land'].includes(p.property_type)).length }
  ]

  // Investment timeline data (last 6 months)
  const investmentTimelineData = (() => {
    const months = []
    const today = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('en', { month: 'short' })
      
      // Calculate cumulative investment up to this month
      const investment = properties
        .filter(p => new Date(p.created_at) <= date)
        .reduce((sum, p) => sum + (p.purchase_price || 0), 0)
      
      const value = properties
        .filter(p => new Date(p.created_at) <= date)
        .reduce((sum, p) => sum + (p.current_value || p.purchase_price || 0), 0)
      
      months.push({
        month: monthName,
        investment: investment / 1000, // Convert to thousands
        value: value / 1000
      })
    }
    return months
  })()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">Welcome back, {user?.email?.split('@')[0]}!</h1>
          <p className="text-indigo-100 mt-1">Here&apos;s your portfolio overview for {new Date().toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Investment</p>
                <p className="text-2xl font-bold text-gray-900">€{stats.totalInvestment.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{stats.totalProperties} properties</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Value</p>
                <p className="text-2xl font-bold text-gray-900">€{stats.currentValue.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 mt-1">+{totalROI}% ROI</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
                <p className="text-xs text-gray-500 mt-1">of {stats.totalProjects} total</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Task Completion</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500 mt-1">{stats.completedTasks} of {stats.totalTasks} tasks</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Investment Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={investmentTimelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `€${value}k`} />
                <Legend />
                <Line type="monotone" dataKey="investment" stroke="#6366F1" name="Investment" strokeWidth={2} />
                <Line type="monotone" dataKey="value" stroke="#10B981" name="Current Value" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Project Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/properties/new"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-center group"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-200 transition-colors">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Add Property</h3>
            <p className="text-sm text-gray-600 mt-1">Add a new property to your portfolio</p>
          </Link>

          <Link
            href="/projects/new"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-center group"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-200 transition-colors">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Create Project</h3>
            <p className="text-sm text-gray-600 mt-1">Start a new renovation project</p>
          </Link>

          <Link
            href="/team"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-center group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Invite Team</h3>
            <p className="text-sm text-gray-600 mt-1">Collaborate with your team</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Properties */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Properties</h3>
              <Link href="/properties" className="text-sm text-indigo-600 hover:text-indigo-500">
                View all →
              </Link>
            </div>
            {properties.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No properties yet</p>
            ) : (
              <div className="space-y-3">
                {properties.slice(0, 3).map((property) => (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{property.name}</p>
                        <p className="text-sm text-gray-600">{property.city}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        €{property.purchase_price?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
              <Link href="/projects" className="text-sm text-indigo-600 hover:text-indigo-500">
                View all →
              </Link>
            </div>
            {projects.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No projects yet</p>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 3).map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{project.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{project.status}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        €{project.budget?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
