'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkUserAndFetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        
        // Fetch properties
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching properties:', error)
        } else {
          setProperties(data || [])
        }
      }
      setLoading(false)
    }

    checkUserAndFetchData()
  }, [router, supabase])

  function calculateTotalInvestment() {
    return properties.reduce((sum, property) => sum + (property.purchase_price || 0), 0)
  }

  function calculateTotalValue() {
    return properties.reduce((sum, property) => sum + (property.current_value || property.purchase_price || 0), 0)
  }

  function calculateActiveProjects() {
    // This would be calculated from projects table when implemented
    return 0
  }

  function calculateAverageROI() {
    if (properties.length === 0) return 0
    
    const totalROI = properties.reduce((sum, property) => {
      const purchase = property.purchase_price || 0
      const current = property.current_value || purchase
      return sum + (purchase > 0 ? ((current - purchase) / purchase) * 100 : 0)
    }, 0)
    
    return totalROI / properties.length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your properties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Property Dashboard</h1>
              <p className="text-indigo-100 mt-1">Welcome back, {user?.email}</p>
            </div>
            <Link
              href="/properties/new"
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Property
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Total Properties</p>
                  <p className="text-3xl font-bold mt-1">{properties.length}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Active Projects</p>
                  <p className="text-3xl font-bold mt-1">{calculateActiveProjects()}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Total Investment</p>
                  <p className="text-3xl font-bold mt-1">€{calculateTotalInvestment().toLocaleString()}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Portfolio Value</p>
                  <p className="text-3xl font-bold mt-1">€{calculateTotalValue().toLocaleString()}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Properties in Puglia</h2>
          
          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.length > 0 ? (
              properties.map((property) => (
                <div key={property.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  {/* Property Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-indigo-400 to-emerald-400 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-semibold text-lg">{property.name}</p>
                      <p className="text-white/80 text-sm">{property.city}, Puglia</p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                        {property.property_type || 'Property'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.address}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Purchase Price</p>
                        <p className="text-lg font-semibold text-gray-900">
                          €{property.purchase_price?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      {property.size_sqm && (
                        <div>
                          <p className="text-xs text-gray-500">Size</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {property.size_sqm} m²
                          </p>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/properties/${property.id}`}
                      className="block w-full bg-indigo-600 text-white py-2 rounded-lg font-medium text-center hover:bg-indigo-700 transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-white rounded-xl shadow-sm p-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                  <p className="text-gray-500 mb-4">Get started by adding your first property!</p>
                  <Link
                    href="/properties/new"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Your First Property
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Useful Resources for Investors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h4 className="font-semibold mb-2">Required Documents</h4>
              <p className="text-sm text-gray-600">Complete checklist for property purchase in Italy</p>
              <Link href="/guides/documents" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-3 inline-block">
                View Checklist →
              </Link>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🏛️</span>
              </div>
              <h4 className="font-semibold mb-2">Permits & Applications</h4>
              <p className="text-sm text-gray-600">SCIA, CILA, and Building Permits management</p>
              <Link href="/guides/permits" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium mt-3 inline-block">
                Learn More →
              </Link>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h4 className="font-semibold mb-2">Local Professionals</h4>
              <p className="text-sm text-gray-600">Find geometri, notaries, and contractors in your area</p>
              <Link href="/professionals" className="text-purple-600 hover:text-purple-700 text-sm font-medium mt-3 inline-block">
                Browse Directory →
              </Link>
            </div>
          </div>
        </div>

        {/* Grant Calculator CTA */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-emerald-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Maximize Your Investment with Grants</h3>
          <p className="text-lg mb-6 text-white/90">
            Check your eligibility for Mini PIA grants up to €2.25M
          </p>
          <a
            href="https://investiscope.net/calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Calculate My Grant Eligibility
          </a>
        </div>
      </main>
    </div>
  )
}
