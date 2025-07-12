// File: app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Heart, FileText, Calculator, Users, TrendingUp, Globe, AlertCircle, BookOpen, ChevronRight, Home, MapPin, Euro } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [savedProperties, setSavedProperties] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUserAndFetchData()
  }, [])

  async function checkUserAndFetchData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      setUser(user)
      
      // Fetch user profile to check if they own properties
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setUserProfile(profile)
      
      // Fetch saved properties (wishlist)
      const { data: wishlist } = await supabase
        .from('property_wishlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      setSavedProperties(wishlist || [])
      
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Preparing your Italian property journey...</p>
        </div>
      </div>
    )
  }

  // Mock data for demo - in production, this would come from your API
  const marketInsights = [
    { region: 'Puglia', trend: 'up', change: '+12%', avgPrice: '€1,200/m²' },
    { region: 'Tuscany', trend: 'stable', change: '+2%', avgPrice: '€2,800/m²' },
    { region: 'Sicily', trend: 'up', change: '+18%', avgPrice: '€950/m²' },
  ]

  const upcomingTasks = [
    { task: 'Get Codice Fiscale', status: 'pending', description: 'Required for property purchase' },
    { task: 'Open Italian Bank Account', status: 'pending', description: 'Needed for transactions' },
    { task: 'Find a Notary', status: 'pending', description: 'Essential for closing' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header - Personalized for buyers */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome to Your Italian Property Journey
              </h1>
              <p className="text-gray-600 mt-2">
                Let's find your perfect property in Italy. We'll guide you every step of the way.
              </p>
            </div>
            <div className="hidden lg:block bg-indigo-100 rounded-lg p-4">
              <p className="text-sm text-indigo-800 font-medium">Your Journey Stage</p>
              <p className="text-lg font-bold text-indigo-900">Searching & Learning</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions for Buyers */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/search" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all border-2 border-transparent hover:border-indigo-500">
            <Search className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="font-semibold text-gray-900">Search Properties</h3>
            <p className="text-sm text-gray-600 mt-1">Browse Italian listings in English</p>
          </Link>

          <Link href="/wishlist" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all border-2 border-transparent hover:border-indigo-500">
            <Heart className="w-8 h-8 text-red-500 mb-3" />
            <h3 className="font-semibold text-gray-900">My Wishlist</h3>
            <p className="text-sm text-gray-600 mt-1">{savedProperties.length} saved properties</p>
          </Link>

          <Link href="/calculator" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all border-2 border-transparent hover:border-indigo-500">
            <Calculator className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900">Cost Calculator</h3>
            <p className="text-sm text-gray-600 mt-1">Estimate total purchase costs</p>
          </Link>

          <Link href="/professionals" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all border-2 border-transparent hover:border-indigo-500">
            <Users className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900">Find Professionals</h3>
            <p className="text-sm text-gray-600 mt-1">Lawyers, notaries & more</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Getting Started Guide */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                Your Buying Checklist
              </h2>
              <div className="space-y-3">
                {upcomingTasks.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" className="mt-1" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.task}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
                  </div>
                ))}
              </div>
              <Link href="/guide" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mt-4 text-sm font-medium">
                View Complete Buying Guide
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Market Insights */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Market Insights
              </h2>
              <div className="space-y-3">
                {marketInsights.map((region, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{region.region}</p>
                        <p className="text-sm text-gray-600">{region.avgPrice}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${region.trend === 'up' ? 'text-green-600' : 'text-gray-600'}`}>
                      {region.change}
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/market-report" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mt-4 text-sm font-medium">
                Full Market Report
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Recent Searches or Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Properties</h2>
              {savedProperties.length > 0 ? (
                <div className="space-y-3">
                  {savedProperties.slice(0, 3).map((property, idx) => (
                    <div key={idx} className="flex gap-4 p-3 border rounded-lg hover:border-indigo-300 cursor-pointer">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Home className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{property.title}</p>
                        <p className="text-sm text-gray-600">{property.location}</p>
                        <p className="text-sm font-semibold text-indigo-600">{property.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No saved properties yet</p>
                  <Link href="/search" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Start Searching →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Help Card */}
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="font-semibold text-indigo-900 mb-3">Need Help?</h3>
              <p className="text-sm text-indigo-700 mb-4">
                Our experts are here to guide you through the Italian property buying process.
              </p>
              <Link href="/consultation" className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Book Free Consultation
              </Link>
            </div>

            {/* Learning Resources */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Learning Center</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/guides/codice-fiscale" className="text-sm text-gray-600 hover:text-indigo-600 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    How to Get a Codice Fiscale
                  </Link>
                </li>
                <li>
                  <Link href="/guides/property-types" className="text-sm text-gray-600 hover:text-indigo-600 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Italian Property Types Explained
                  </Link>
                </li>
                <li>
                  <Link href="/guides/regions" className="text-sm text-gray-600 hover:text-indigo-600 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Best Regions for Investment
                  </Link>
                </li>
              </ul>
            </div>

            {/* Currency & Tools */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Tools</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">EUR/USD</span>
                  <span className="font-medium">1.09</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">EUR/GBP</span>
                  <span className="font-medium">0.86</span>
                </div>
              </div>
              <Link href="/tools" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mt-3 text-sm font-medium">
                More Tools
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Success Message for New Users */}
        {userProfile?.is_new && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-green-900">Welcome to InvestiScope!</h3>
                <p className="text-green-700 mt-1">
                  Your account is all set up. Start by searching for properties or reading our buying guide to understand the process.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
