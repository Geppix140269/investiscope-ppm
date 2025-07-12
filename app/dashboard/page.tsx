// File: app/dashboard/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BuyerDashboard from './buyer-dashboard'
import OwnerDashboard from './owner-dashboard'
import { ToggleLeft, ToggleRight } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dashboardMode, setDashboardMode] = useState<'buyer' | 'owner' | null>(null)
  const [showModeSwitcher, setShowModeSwitcher] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUserAndDetermineMode()
  }, [])

  async function checkUserAndDetermineMode() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }
      
      setUser(user)
      
      // Check if user has properties to determine their mode
      const { data: properties } = await supabase
        .from('properties')
        .select('id')
        .limit(1)

      const hasProperties = properties && properties.length > 0

      // Check user's preferred mode from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_mode')
        .eq('id', user.id)
        .single()

      if (profile?.user_mode) {
        setDashboardMode(profile.user_mode)
        // Show switcher if they have properties (can be both buyer and owner)
        setShowModeSwitcher(!!hasProperties) // Convert to boolean
      } else {
        // Auto-determine based on whether they have properties
        setDashboardMode(hasProperties ? 'owner' : 'buyer')
        setShowModeSwitcher(!!hasProperties) // Convert to boolean
      }
    } catch (error) {
      console.error('Dashboard error:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  async function handleModeSwitch(newMode: 'buyer' | 'owner') {
    setDashboardMode(newMode)
    
    // Save preference to profile
    if (user) {
      await supabase
        .from('profiles')
        .update({ user_mode: newMode })
        .eq('id', user.id)
    }
  }

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

  if (!dashboardMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to InvestiScope!</h1>
          <p className="text-gray-600 mb-8">Choose how you&apos;d like to use the platform:</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleModeSwitch('buyer')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              I&apos;m Looking to Buy
            </button>
            <button
              onClick={() => handleModeSwitch('owner')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              I Own Property
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mode Switcher */}
      {showModeSwitcher && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Dashboard Mode:</p>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleModeSwitch('buyer')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    dashboardMode === 'buyer'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Buyer View
                </button>
                <button
                  onClick={() => handleModeSwitch('owner')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    dashboardMode === 'owner'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Owner View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dashboardMode === 'buyer' ? (
          <BuyerDashboard />
        ) : (
          <OwnerDashboard />
        )}
      </div>
    </div>
  )
}
