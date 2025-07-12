// File: app/wishlist/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, MapPin, Euro, Square, Calendar, Star, FileText, Eye, Trash2, Edit, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function WishlistPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const router = useRouter()
  const supabase = createClient()

  // Comparison state
  const [compareMode, setCompareMode] = useState(false)
  const [compareProperties, setCompareProperties] = useState<string[]>([])

  useEffect(() => {
    checkUserAndFetchWishlist()
  }, [filterStatus, sortBy])

  async function checkUserAndFetchWishlist() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Fetch only wishlist properties (not owned)
    let query = supabase
      .from('properties')
      .select('*')
      .neq('status', 'owned')

    // Apply status filter
    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus)
    }

    // Apply sorting
    if (sortBy === 'created_at') {
      query = query.order('created_at', { ascending: false })
    } else if (sortBy === 'price_low') {
      query = query.order('listing_price', { ascending: true })
    } else if (sortBy === 'price_high') {
      query = query.order('listing_price', { ascending: false })
    } else if (sortBy === 'viewing_date') {
      query = query.order('metadata->viewing_date', { ascending: true })
    }

    const { data, error } = await query

    if (!error) {
      setProperties(data || [])
    }
    setLoading(false)
  }

  async function updatePropertyStatus(propertyId: string, newStatus: string) {
    const { error } = await supabase
      .from('properties')
      .update({ status: newStatus })
      .eq('id', propertyId)

    if (!error) {
      checkUserAndFetchWishlist()
    }
  }

  async function removeFromWishlist(propertyId: string) {
    if (!confirm('Remove this property from your wishlist?')) return

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId)

    if (!error) {
      checkUserAndFetchWishlist()
    }
  }

  function toggleCompare(propertyId: string) {
    if (compareProperties.includes(propertyId)) {
      setCompareProperties(compareProperties.filter(id => id !== propertyId))
    } else if (compareProperties.length < 3) {
      setCompareProperties([...compareProperties, propertyId])
    } else {
      alert('You can compare up to 3 properties at a time')
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'wishlist': return <Heart className="w-5 h-5 text-gray-500" />
      case 'viewing': return <Eye className="w-5 h-5 text-blue-500" />
      case 'offer': return <FileText className="w-5 h-5 text-green-500" />
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case 'wishlist': return 'Saved'
      case 'viewing': return 'Viewing Scheduled'
      case 'offer': return 'Offer Made'
      case 'rejected': return 'Not Suitable'
      default: return status
    }
  }

  const stats = {
    total: properties.length,
    viewing: properties.filter(p => p.status === 'viewing').length,
    offers: properties.filter(p => p.status === 'offer').length,
    avgPrice: properties.length > 0 
      ? Math.round(properties.reduce((sum, p) => sum + (p.listing_price || 0), 0) / properties.length)
      : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-light text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-1">Properties you're actively considering</p>
            </div>
            <div className="flex gap-3">
              {properties.length > 1 && (
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    compareMode 
                      ? 'bg-gray-900 text-white border-gray-900' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {compareMode ? 'Done Comparing' : 'Compare Properties'}
                </button>
              )}
              <Link
                href="/search"
                className="bg-gray-900 text-white px-6 py-2 hover:bg-gray-800 transition-colors"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Saved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Viewings Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.viewing}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Offers Made</p>
                <p className="text-2xl font-bold text-gray-900">{stats.offers}</p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Price</p>
                <p className="text-2xl font-bold text-gray-900">€{stats.avgPrice.toLocaleString()}</p>
              </div>
              <Euro className="w-8 h-8 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              >
                <option value="all">All Status</option>
                <option value="wishlist">Saved Only</option>
                <option value="viewing">Viewing Scheduled</option>
                <option value="offer">Offer Made</option>
                <option value="rejected">Not Suitable</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              >
                <option value="created_at">Recently Added</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="viewing_date">Viewing Date</option>
              </select>
            </div>

            {compareMode && compareProperties.length >= 2 && (
              <button
                onClick={() => router.push(`/compare?ids=${compareProperties.join(',')}`)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Compare {compareProperties.length} Properties
              </button>
            )}
          </div>
        </div>

        {/* Properties List */}
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-12">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties in your wishlist</h3>
              <p className="text-gray-500 mb-6">
                Start browsing properties and save the ones you like
              </p>
              <Link
                href="/search"
                className="bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition-colors inline-block"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{property.name}</h3>
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                          {getStatusIcon(property.status)}
                          {getStatusLabel(property.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-600 mb-3">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {property.city}
                        </span>
                        <span>{property.property_type}</span>
                        {property.size_sqm && (
                          <span className="flex items-center">
                            <Square className="w-4 h-4 mr-1" />
                            {property.size_sqm} m²
                          </span>
                        )}
                        {property.metadata?.bedrooms && (
                          <span>{property.metadata.bedrooms} bed • {property.metadata.bathrooms || '?'} bath</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        €{property.listing_price?.toLocaleString() || 'TBD'}
                      </p>
                      {property.purchase_price && property.listing_price && (
                        <p className="text-sm text-gray-500">
                          vs estimate: €{property.purchase_price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {property.metadata?.viewing_date && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        Viewing: {new Date(property.metadata.viewing_date).toLocaleDateString()}
                      </div>
                    )}
                    {property.metadata?.agent?.name && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">🏢</span>
                        Agent: {property.metadata.agent.name}
                      </div>
                    )}
                    {property.listing_url && (
                      <a
                        href={property.listing_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                      >
                        View Original Listing →
                      </a>
                    )}
                  </div>

                  {/* Notes */}
                  {property.notes && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 italic">"{property.notes}"</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      <button
                        onClick={() => updatePropertyStatus(property.id, 'viewing')}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          property.status === 'viewing' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        Viewing
                      </button>
                      <button
                        onClick={() => updatePropertyStatus(property.id, 'offer')}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          property.status === 'offer' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <FileText className="w-4 h-4 inline mr-1" />
                        Made Offer
                      </button>
                      <button
                        onClick={() => updatePropertyStatus(property.id, 'rejected')}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          property.status === 'rejected' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <XCircle className="w-4 h-4 inline mr-1" />
                        Not Suitable
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {compareMode && (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={compareProperties.includes(property.id)}
                            onChange={() => toggleCompare(property.id)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-600">Compare</span>
                        </label>
                      )}
                      <Link
                        href={`/properties/${property.id}/edit`}
                        className="p-2 text-gray-600 hover:text-gray-900"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(property.id)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/properties/${property.id}`}
                        className="bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-800 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
