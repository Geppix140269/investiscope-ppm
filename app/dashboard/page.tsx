// File: app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import BuyerDashboard from './buyer-dashboard'
import OwnerDashboard from './owner-dashboard'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [userType, setUserType] = useState<'buyer' | 'owner' | 'both' | null>(null)
  const [loading, setLoading] = useState(true)
  const [dashboardMode, setDashboardMode] = useState<'buyer' | 'owner'>('buyer')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUserAndDetermineType()
  }, [])

  async function checkUserAndDetermineType() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      setUser(user)
      
      // Check if user owns any properties
      const { data: properties } = await supabase
        .from('properties')
        .select('id, status')
        .eq('user_id', user.id)

      if (!properties || properties.length === 0) {
        setUserType('buyer')
        setDashboardMode('buyer')
      } else {
        const ownedProperties = properties.filter(p => 
          !p.status || p.status === 'owned'
        )
        const wishlistProperties = properties.filter(p => 
          p.status && p.status !== 'owned'
        )
        
        if (ownedProperties.length > 0 && wishlistProperties.length > 0) {
          setUserType('both')
          // Default to owner view if they have owned properties
          setDashboardMode('owner')
        } else if (ownedProperties.length > 0) {
          setUserType('owner')
          setDashboardMode('owner')
        } else {
          setUserType('buyer')
          setDashboardMode('buyer')
        }
      }
    } catch (error) {
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with mode switcher */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-light text-gray-900">Dashboard</h1>
            
            {userType === 'both' && (
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setDashboardMode('buyer')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    dashboardMode === 'buyer' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Buyer Mode
                </button>
                <button
                  onClick={() => setDashboardMode('owner')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    dashboardMode === 'owner' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Owner Mode
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dashboardMode === 'buyer' ? (
          <BuyerDashboard user={user} />
        ) : (
          <OwnerDashboard user={user} />
        )}
      </div>
    </div>
  )
}
