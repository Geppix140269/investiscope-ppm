'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
      setLoading(false)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">InvestiScope PPM</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user.email}</span>
              <button
                onClick={signOut}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Properties</h2>
          
          {/* Add Property Button */}
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-6">
            + Add New Property
          </button>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Property Card Example */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Sample Property</h3>
              <p className="text-gray-600 mb-4">123 Main Street, Paris</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">No projects yet</span>
                <button className="text-blue-500 hover:text-blue-700 text-sm">
                  View Details →
                </button>
              </div>
            </div>

            {/* Empty State */}
            <div className="col-span-full text-center py-12 text-gray-500">
              <p>No properties added yet. Click "Add New Property" to get started!</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Properties</h3>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Investment</h3>
            <p className="text-2xl font-bold text-gray-900">€0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Portfolio Value</h3>
            <p className="text-2xl font-bold text-gray-900">€0</p>
          </div>
        </div>
      </main>
    </div>
  )
}
