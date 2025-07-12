// File: app/wishlist/page.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Heart, Trash2, ExternalLink, Phone, Mail, Calendar,
  MapPin, Home, Euro, ChevronRight, Filter, Download,
  TrendingUp, Clock, Eye, FileText, Share2, CheckCircle
} from 'lucide-react'

interface Agent {
  name: string
  phone: string
  email: string
}

interface SavedProperty {
  id: string
  name: string
  location: string
  price: number
  type: string
  bedrooms: number
  bathrooms: number
  size: number
  image: string
  listingUrl?: string
  agent?: Agent
  savedDate: string
  status: 'saved' | 'viewing_scheduled' | 'offer_made' | 'purchased'
  viewingDate?: string
  notes?: string
}

export default function WishlistPage() {
  const [properties, setProperties] = useState<SavedProperty[]>([
    {
      id: '1',
      name: 'Trullo with Olive Grove',
      location: 'Alberobello, Puglia',
      price: 145000,
      type: 'Trullo',
      bedrooms: 2,
      bathrooms: 1,
      size: 100,
      image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop',
      listingUrl: 'https://example.com/property/1',
      agent: {
        name: 'Marco Rossi',
        phone: '+39 080 123 4567',
        email: 'marco@example.com'
      },
      savedDate: '2024-01-15',
      status: 'viewing_scheduled',
      viewingDate: '2024-02-15',
      notes: 'Beautiful property with original features'
    },
    {
      id: '2',
      name: 'Sea View Apartment',
      location: 'Polignano a Mare, Puglia',
      price: 280000,
      type: 'Apartment',
      bedrooms: 3,
      bathrooms: 2,
      size: 120,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      savedDate: '2024-01-10',
      status: 'saved'
    },
    {
      id: '3',
      name: 'Historic Masseria',
      location: 'Ostuni, Puglia',
      price: 450000,
      type: 'Masseria',
      bedrooms: 5,
      bathrooms: 3,
      size: 300,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      savedDate: '2024-01-05',
      status: 'offer_made',
      notes: 'Offered €420,000'
    }
  ])

  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('date')
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])

  const statusConfig = {
    saved: { color: 'bg-gray-100 text-gray-800', label: 'Saved', icon: Heart },
    viewing_scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Viewing Scheduled', icon: Calendar },
    offer_made: { color: 'bg-yellow-100 text-yellow-800', label: 'Offer Made', icon: FileText },
    purchased: { color: 'bg-green-100 text-green-800', label: 'Purchased', icon: CheckCircle }
  }

  const stats = {
    total: properties.length,
    viewing_scheduled: properties.filter(p => p.status === 'viewing_scheduled').length,
    offers_made: properties.filter(p => p.status === 'offer_made').length,
    total_value: properties.reduce((sum, p) => sum + p.price, 0)
  }

  const handleStatusChange = (propertyId: string, newStatus: SavedProperty['status']) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, status: newStatus } : p
    ))
  }

  const handleRemove = (propertyId: string) => {
    if (confirm('Remove this property from your wishlist?')) {
      setProperties(prev => prev.filter(p => p.id !== propertyId))
    }
  }

  const togglePropertySelection = (propertyId: string) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  const exportToCSV = () => {
    const headers = ['Name', 'Location', 'Price', 'Type', 'Status', 'Agent', 'Notes']
    const rows = properties.map(p => [
      p.name,
      p.location,
      p.price,
      p.type,
      p.status,
      p.agent ? `${p.agent.name} - ${p.agent.phone}` : '',
      p.notes || ''
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wishlist-properties.csv'
    a.click()
  }

  const filteredProperties = properties
    .filter(p => filterStatus === 'all' || p.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime()
      if (sortBy === 'price') return b.price - a.price
      return 0
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-1">Track and manage your favorite properties</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <Link
                href="/search"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Heart className="w-4 h-4" />
                Find More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Saved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Viewings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.viewing_scheduled}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Offers Made</p>
                <p className="text-2xl font-bold text-gray-900">{stats.offers_made}</p>
              </div>
              <FileText className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">€{stats.total_value.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filter by:</span>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="saved">Saved</option>
              <option value="viewing_scheduled">Viewing Scheduled</option>
              <option value="offer_made">Offer Made</option>
              <option value="purchased">Purchased</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
            </select>
            
            {selectedProperties.length > 0 && (
              <button
                onClick={() => setSelectedProperties([])}
                className="ml-auto text-sm text-blue-600 hover:text-blue-700"
              >
                Clear selection ({selectedProperties.length})
              </button>
            )}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            const config = statusConfig[property.status]
            const StatusIcon = config.icon
            
            return (
              <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Property Image */}
                <div className="relative h-48">
                  <img 
                    src={property.image} 
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => togglePropertySelection(property.id)}
                      className={`p-2 rounded-full ${
                        selectedProperties.includes(property.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/90 text-gray-700'
                      } hover:bg-opacity-100 transition-colors`}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRemove(property.id)}
                      className="p-2 bg-white/90 rounded-full text-red-600 hover:bg-white transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                      <StatusIcon className="w-3 h-3 inline mr-1" />
                      {config.label}
                    </span>
                  </div>
                </div>
                
                {/* Property Details */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.name}</h3>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">€{property.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">{property.type}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                    <span>{property.size} m²</span>
                  </div>
                  
                  {/* Agent Info */}
                  {property.agent && (
                    <div className="border-t pt-4 mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Agent: {property.agent.name}</p>
                      <div className="flex gap-2">
                        <a
                          href={`tel:${property.agent.phone}`}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                        <a
                          href={`mailto:${property.agent.email}`}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Notes */}
                  {property.notes && (
                    <p className="text-sm text-gray-600 italic mb-4">&quot;{property.notes}&quot;</p>
                  )}
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    {property.listingUrl && (
                      <a
                        href={property.listingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Listing
                      </a>
                    )}
                    <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Status Update */}
                  <div className="mt-4">
                    <label className="text-xs text-gray-600">Update Status:</label>
                    <select
                      value={property.status}
                      onChange={(e) => handleStatusChange(property.id, e.target.value as SavedProperty['status'])}
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="saved">Saved</option>
                      <option value="viewing_scheduled">Viewing Scheduled</option>
                      <option value="offer_made">Offer Made</option>
                      <option value="purchased">Purchased</option>
                    </select>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Compare Properties */}
        {selectedProperties.length >= 2 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <p className="text-gray-700">
                <span className="font-semibold">{selectedProperties.length} properties</span> selected for comparison
              </p>
              <Link
                href={`/compare?ids=${selectedProperties.join(',')}`}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Compare Properties
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'all' 
                ? 'Start adding properties to your wishlist' 
                : 'No properties match your filter criteria'}
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Heart className="w-5 h-5" />
              Browse Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
