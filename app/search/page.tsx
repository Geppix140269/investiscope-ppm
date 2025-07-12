// File: app/search/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Plus, Filter, MapPin, Home, Euro, Square, Calendar, Heart, X, ChevronDown, Upload, FileText, Camera } from 'lucide-react'

export default function PropertySearchPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCity, setFilterCity] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterPriceRange, setFilterPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const router = useRouter()
  const supabase = createClient()

  // Form state for adding properties
  const [formData, setFormData] = useState({
    name: '',
    listing_price: '',
    address: '',
    city: '',
    property_type: 'apartment',
    size_sqm: '',
    bedrooms: '',
    bathrooms: '',
    listing_url: '',
    agent_name: '',
    agent_phone: '',
    agent_email: '',
    notes: '',
    viewing_date: '',
    photos: [] as File[]
  })

  const cities = [
    'Bari', 'Lecce', 'Brindisi', 'Taranto', 'Foggia',
    'Monopoli', 'Ostuni', 'Alberobello', 'Polignano a Mare',
    'Rome', 'Milan', 'Florence', 'Venice', 'Naples'
  ]

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: '🏢' },
    { value: 'house', label: 'House/Villa', icon: '🏠' },
    { value: 'trullo', label: 'Trullo', icon: '🏛️' },
    { value: 'masseria', label: 'Masseria', icon: '🏘️' },
    { value: 'palazzo', label: 'Palazzo', icon: '🏰' },
    { value: 'land', label: 'Land', icon: '🌳' },
    { value: 'commercial', label: 'Commercial', icon: '🏪' }
  ]

  const priceRanges = [
    { value: 'all', label: 'Any Price' },
    { value: '0-100000', label: 'Under €100k' },
    { value: '100000-250000', label: '€100k - €250k' },
    { value: '250000-500000', label: '€250k - €500k' },
    { value: '500000-1000000', label: '€500k - €1M' },
    { value: '1000000+', label: 'Over €1M' }
  ]

  useEffect(() => {
    checkUserAndFetchProperties()
  }, [sortBy])

  async function checkUserAndFetchProperties() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Fetch wishlist properties
    let query = supabase
      .from('properties')
      .select('*')
      .in('status', ['wishlist', 'viewing', 'offer'])

    // Apply sorting
    if (sortBy === 'created_at') {
      query = query.order('created_at', { ascending: false })
    } else if (sortBy === 'price_low') {
      query = query.order('listing_price', { ascending: true })
    } else if (sortBy === 'price_high') {
      query = query.order('listing_price', { ascending: false })
    }

    const { data, error } = await query

    if (!error) {
      setProperties(data || [])
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Create property with wishlist status
    const { data, error } = await supabase
      .from('properties')
      .insert({
        ...formData,
        user_id: user.id,
        status: 'wishlist',
        listing_price: formData.listing_price ? parseFloat(formData.listing_price) : null,
        size_sqm: formData.size_sqm ? parseFloat(formData.size_sqm) : null,
        metadata: {
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          agent: {
            name: formData.agent_name,
            phone: formData.agent_phone,
            email: formData.agent_email
          },
          viewing_date: formData.viewing_date
        }
      })
      .select()
      .single()

    if (error) {
      alert('Error adding property: ' + error.message)
    } else {
      // Handle photo uploads if any
      if (formData.photos.length > 0 && data) {
        // Upload photos logic here
      }
      
      setShowAddForm(false)
      resetForm()
      checkUserAndFetchProperties()
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      listing_price: '',
      address: '',
      city: '',
      property_type: 'apartment',
      size_sqm: '',
      bedrooms: '',
      bathrooms: '',
      listing_url: '',
      agent_name: '',
      agent_phone: '',
      agent_email: '',
      notes: '',
      viewing_date: '',
      photos: []
    })
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCity = filterCity === 'all' || property.city === filterCity
    const matchesType = filterType === 'all' || property.property_type === filterType
    
    let matchesPrice = true
    if (filterPriceRange !== 'all') {
      const price = property.listing_price || 0
      if (filterPriceRange === '0-100000') matchesPrice = price <= 100000
      else if (filterPriceRange === '100000-250000') matchesPrice = price > 100000 && price <= 250000
      else if (filterPriceRange === '250000-500000') matchesPrice = price > 250000 && price <= 500000
      else if (filterPriceRange === '500000-1000000') matchesPrice = price > 500000 && price <= 1000000
      else if (filterPriceRange === '1000000+') matchesPrice = price > 1000000
    }
    
    return matchesSearch && matchesCity && matchesType && matchesPrice
  })

  const toggleFavorite = async (propertyId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'wishlist' ? 'viewing' : 'wishlist'
    
    const { error } = await supabase
      .from('properties')
      .update({ status: newStatus })
      .eq('id', propertyId)

    if (!error) {
      checkUserAndFetchProperties()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your property search...</p>
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
              <h1 className="text-2xl font-light text-gray-900">Property Search</h1>
              <p className="text-gray-600 mt-1">                Track properties you&apos;re interested in</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Property
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, address, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
            >
              <option value="all">All Types</option>
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            <select
              value={filterPriceRange}
              onChange={(e) => setFilterPriceRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
            >
              {priceRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
            >
              <option value="created_at">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold">{filteredProperties.length}</span> properties
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Properties Grid/List */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-12">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterCity !== 'all' || filterType !== 'all' || filterPriceRange !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start by adding properties you\'re interested in'}
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Property
              </button>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all ${
                  viewMode === 'list' ? 'p-6' : ''
                }`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <div>
                    <div className="h-48 bg-gray-200 rounded-t-xl relative">
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => toggleFavorite(property.id, property.status)}
                          className="bg-white/90 backdrop-blur p-2 rounded-full hover:bg-white transition-colors"
                        >
                          <Heart className={`w-5 h-5 ${property.status === 'viewing' ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                          {propertyTypes.find(t => t.value === property.property_type)?.icon} {property.property_type}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{property.name}</h3>
                      <div className="flex items-center text-gray-600 text-sm mb-4">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.city}
                        {property.address && `, ${property.address}`}
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-2xl font-bold">€{property.listing_price?.toLocaleString() || 'TBD'}</p>
                        </div>
                        {property.size_sqm && (
                          <div className="text-sm text-gray-600">
                            <Square className="w-4 h-4 inline mr-1" />
                            {property.size_sqm} m²
                          </div>
                        )}
                      </div>
                      {property.metadata?.bedrooms && (
                        <div className="text-sm text-gray-600 mb-4">
                          {property.metadata.bedrooms} bed • {property.metadata.bathrooms || '?'} bath
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Link
                          href={`/properties/${property.id}`}
                          className="flex-1 bg-gray-900 text-white py-2 text-center hover:bg-gray-800 transition-colors"
                        >
                          View Details
                        </Link>
                        {property.metadata?.viewing_date && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(property.metadata.viewing_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{property.name}</h3>
                        <button
                          onClick={() => toggleFavorite(property.id, property.status)}
                          className="ml-4"
                        >
                          <Heart className={`w-5 h-5 ${property.status === 'viewing' ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {property.city}
                        </span>
                        <span>{propertyTypes.find(t => t.value === property.property_type)?.label}</span>
                        {property.size_sqm && (
                          <span className="flex items-center">
                            <Square className="w-4 h-4 mr-1" />
                            {property.size_sqm} m²
                          </span>
                        )}
                        {property.metadata?.bedrooms && (
                          <span>{property.metadata.bedrooms} bed</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold">€{property.listing_price?.toLocaleString() || 'TBD'}</p>
                        <Link
                          href={`/properties/${property.id}`}
                          className="text-gray-900 hover:text-gray-700 font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add Property to Wishlist</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-medium mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Name/Reference *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                      placeholder="e.g., Trullo near Ostuni, Via Roma Apartment"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type
                    </label>
                    <select
                      value={formData.property_type}
                      onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                    >
                      {propertyTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asking Price (€)
                    </label>
                    <input
                      type="number"
                      value={formData.listing_price}
                      onChange={(e) => setFormData({ ...formData, listing_price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                      placeholder="350000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size (m²)
                    </label>
                    <input
                      type="number"
                      value={formData.size_sqm}
                      onChange={(e) => setFormData({ ...formData, size_sqm: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                      placeholder="120"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <select
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="">Select a city</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address/Location
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                      placeholder="Street address or general area"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                      placeholder="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                      placeholder="2"
                    />
                  </div>
                </div>
              </div>

              {/* Source Info */}
              <div>
                <h3 className="font-medium mb-4">Source Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Listing URL (if available)
                    </label>
                    <input
                      type="url"
                      value={formData.listing_url}
                      onChange={(e) => setFormData({ ...formData, listing_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                      placeholder="https://..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Save the link for your reference (we cannot import data automatically)
                    </p>
                  </div>
                </div>
              </div>

              {/* Agent Info */}
              <div>
                <h3 className="font-medium mb-4">Agent Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agent Name
                    </label>
                    <input
                      type="text"
                      value={formData.agent_name}
                      onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agent Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.agent_phone}
                      onChange={(e) => setFormData({ ...formData, agent_phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agent Email
                    </label>
                    <input
                      type="email"
                      value={formData.agent_email}
                      onChange={(e) => setFormData({ ...formData, agent_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Viewing */}
              <div>
                <h3 className="font-medium mb-4">Viewing Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Viewing Date
                  </label>
                  <input
                    type="date"
                    value={formData.viewing_date}
                    onChange={(e) => setFormData({ ...formData, viewing_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                  placeholder="Your private notes about this property..."
                />
              </div>

              {/* Photos Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Upload photos from your viewing
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                    onChange={(e) => {
                      if (e.target.files) {
                        setFormData({ ...formData, photos: Array.from(e.target.files) })
                      }
                    }}
                  />
                  <label
                    htmlFor="photo-upload"
                    className="mt-2 text-sm text-gray-900 hover:text-gray-700 cursor-pointer inline-block"
                  >
                    Choose files
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white py-3 hover:bg-gray-800 transition-colors"
                >
                  Add to Wishlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
