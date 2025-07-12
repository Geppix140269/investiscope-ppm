// File: app/professionals/page.tsx

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, MapPin, Star, Phone, Mail, Globe, Filter, X, ChevronDown } from 'lucide-react'

// Mock data for professionals
const mockProfessionals = [
  {
    id: 1,
    name: 'Marco Rossi',
    profession: 'Real Estate Agent',
    company: 'Puglia Property Experts',
    location: 'Bari',
    rating: 4.8,
    reviews: 127,
    specialties: ['Luxury Properties', 'Investment Properties', 'International Clients'],
    languages: ['Italian', 'English', 'French'],
    phone: '+39 080 555 0123',
    email: 'marco@pugliapropertyexperts.it',
    website: 'www.pugliapropertyexperts.it',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
    verified: true,
    featured: true,
    description: 'With over 15 years of experience in Puglia real estate, I specialize in helping international buyers find their dream properties.'
  },
  {
    id: 2,
    name: 'Sofia Bianchi',
    profession: 'Architect',
    company: 'Studio Bianchi Architecture',
    location: 'Lecce',
    rating: 4.9,
    reviews: 89,
    specialties: ['Historic Renovations', 'Modern Design', 'Sustainable Architecture'],
    languages: ['Italian', 'English'],
    phone: '+39 0832 555 0456',
    email: 'sofia@studiobianchi.it',
    website: 'www.studiobianchi.it',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop',
    verified: true,
    featured: false,
    description: 'Award-winning architect specializing in the restoration of historic trulli and masserie with a modern touch.'
  },
  {
    id: 3,
    name: 'Giuseppe Marino',
    profession: 'Property Lawyer',
    company: 'Marino Legal Services',
    location: 'Brindisi',
    rating: 4.7,
    reviews: 65,
    specialties: ['Property Law', 'Tax Planning', 'Residency Applications'],
    languages: ['Italian', 'English', 'German'],
    phone: '+39 0831 555 0789',
    email: 'info@marinolegal.it',
    website: 'www.marinolegal.it',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?w=300&h=300&fit=crop',
    verified: true,
    featured: false,
    description: 'Expert in Italian property law with a focus on international transactions and tax optimization strategies.'
  },
  {
    id: 4,
    name: 'Elena Greco',
    profession: 'Interior Designer',
    company: 'Greco Design Studio',
    location: 'Ostuni',
    rating: 5.0,
    reviews: 42,
    specialties: ['Traditional Puglia Style', 'Contemporary Interiors', 'Vacation Rentals'],
    languages: ['Italian', 'English', 'Spanish'],
    phone: '+39 0831 555 0234',
    email: 'elena@grecodesign.it',
    website: 'www.grecodesign.it',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&h=300&fit=crop',
    verified: true,
    featured: true,
    description: 'Creating beautiful, functional spaces that blend traditional Pugliese charm with modern comfort.'
  },
  {
    id: 5,
    name: 'Antonio De Luca',
    profession: 'Building Contractor',
    company: 'De Luca Costruzioni',
    location: 'Monopoli',
    rating: 4.6,
    reviews: 98,
    specialties: ['Full Renovations', 'New Construction', 'Pool Installation'],
    languages: ['Italian', 'English'],
    phone: '+39 080 555 0567',
    email: 'antonio@delucacostruzioni.it',
    website: 'www.delucacostruzioni.it',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    verified: true,
    featured: false,
    description: 'Family-run construction company with 30+ years of experience in residential and commercial projects.'
  },
  {
    id: 6,
    name: 'Francesca Romano',
    profession: 'Property Manager',
    company: 'Romano Property Management',
    location: 'Polignano a Mare',
    rating: 4.8,
    reviews: 73,
    specialties: ['Vacation Rentals', 'Long-term Rentals', 'Property Maintenance'],
    languages: ['Italian', 'English', 'French'],
    phone: '+39 080 555 0890',
    email: 'francesca@romanoproperty.it',
    website: 'www.romanoproperty.it',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
    verified: true,
    featured: false,
    description: 'Professional property management services to maximize your investment returns and peace of mind.'
  }
]

const professionTypes = [
  'All Professions',
  'Real Estate Agent',
  'Architect',
  'Property Lawyer',
  'Interior Designer',
  'Building Contractor',
  'Property Manager',
  'Surveyor',
  'Mortgage Broker'
]

const locations = [
  'All Locations',
  'Bari',
  'Lecce',
  'Brindisi',
  'Ostuni',
  'Monopoli',
  'Polignano a Mare',
  'Alberobello',
  'Martina Franca'
]

const languages = [
  'English',
  'Italian',
  'French',
  'German',
  'Spanish',
  'Dutch',
  'Russian'
]

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState(mockProfessionals)
  const [filteredProfessionals, setFilteredProfessionals] = useState(mockProfessionals)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProfession, setSelectedProfession] = useState('All Professions')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    filterAndSortProfessionals()
  }, [searchTerm, selectedProfession, selectedLocation, selectedLanguages, sortBy])

  const filterAndSortProfessionals = () => {
    let filtered = [...professionals]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pro =>
        pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pro.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pro.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Profession filter
    if (selectedProfession !== 'All Professions') {
      filtered = filtered.filter(pro => pro.profession === selectedProfession)
    }

    // Location filter
    if (selectedLocation !== 'All Locations') {
      filtered = filtered.filter(pro => pro.location === selectedLocation)
    }

    // Language filter
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter(pro =>
        selectedLanguages.every(lang => pro.languages.includes(lang))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return b.rating - a.rating
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating
      }
      if (sortBy === 'reviews') {
        return b.reviews - a.reviews
      }
      return 0
    })

    setFilteredProfessionals(filtered)
  }

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Find Trusted Professionals
          </h1>
          <p className="text-xl text-center text-blue-100 mb-8 max-w-3xl mx-auto">
            Connect with verified real estate experts, architects, lawyers, and more to make your Puglia property journey smooth and successful
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl p-2">
              <div className="flex items-center">
                <Search className="w-5 h-5 text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder="Search by name, company, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center gap-2 mr-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      {showFilters && (
        <section className="bg-white border-b sticky top-16 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-4 items-center">
              <select
                value={selectedProfession}
                onChange={(e) => setSelectedProfession(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {professionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Languages:</span>
                {languages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedLanguages.includes(lang)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ml-auto"
              >
                <option value="featured">Featured First</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredProfessionals.length} Professionals Found
            </h2>
          </div>

          {/* Professionals Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((professional) => (
              <div
                key={professional.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  professional.featured ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                {professional.featured && (
                  <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 text-center">
                    FEATURED PROFESSIONAL
                  </div>
                )}
                
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={professional.image}
                      alt={professional.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {professional.name}
                            {professional.verified && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Verified
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600">{professional.profession}</p>
                          <p className="text-sm text-gray-500">{professional.company}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating and Location */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{professional.rating}</span>
                      <span className="text-sm text-gray-500">({professional.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {professional.location}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {professional.description}
                  </p>

                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {professional.specialties.slice(0, 3).map((specialty, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-4 text-sm text-gray-600">
                    <span className="font-medium">Languages:</span> {professional.languages.join(', ')}
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                    <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      <Globe className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProfessionals.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No professionals found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedProfession('All Professions')
                  setSelectedLocation('All Locations')
                  setSelectedLanguages([])
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Are You a Professional?</h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Join our network of trusted professionals and connect with property buyers and owners in Puglia
            </p>
            <Link
              href="/professionals/join"
              className="inline-block px-8 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Join Our Network
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
