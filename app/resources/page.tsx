// File: app/resources/page.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, BookOpen, FileText, Video, Download, Clock, TrendingUp, Home, Briefcase, Shield, Calculator, Globe, ChevronRight } from 'lucide-react'

const resourceCategories = [
  { id: 'all', name: 'All Resources', icon: BookOpen },
  { id: 'buying', name: 'Buying Guide', icon: Home },
  { id: 'legal', name: 'Legal & Tax', icon: Shield },
  { id: 'investment', name: 'Investment', icon: TrendingUp },
  { id: 'renovation', name: 'Renovation', icon: Briefcase },
  { id: 'living', name: 'Living in Puglia', icon: Globe }
]

const resources = [
  {
    id: 1,
    title: 'Complete Guide to Buying Property in Puglia',
    description: 'Everything you need to know about purchasing real estate in Puglia, from finding the right property to completing the sale.',
    category: 'buying',
    type: 'guide',
    readTime: '15 min',
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
    topics: ['Property Search', 'Negotiation', 'Legal Process', 'Costs & Fees']
  },
  {
    id: 2,
    title: 'Italian Property Tax Guide 2025',
    description: 'Comprehensive overview of property taxes in Italy, including IMU, TASI, and tax benefits for non-residents.',
    category: 'legal',
    type: 'guide',
    readTime: '20 min',
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    topics: ['IMU Tax', 'TASI', 'Tax Benefits', 'Non-Resident Taxation']
  },
  {
    id: 3,
    title: 'ROI Calculator for Puglia Properties',
    description: 'Interactive tool to calculate potential returns on your Puglia property investment, including rental income projections.',
    category: 'investment',
    type: 'tool',
    readTime: '5 min',
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
    topics: ['ROI Analysis', 'Rental Income', 'Market Trends', 'Investment Strategy']
  },
  {
    id: 4,
    title: 'Trullo Renovation: Step-by-Step Guide',
    description: 'Expert advice on renovating traditional trulli, including permits, costs, and finding the right contractors.',
    category: 'renovation',
    type: 'video',
    readTime: '45 min',
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1597933534024-debb6104af15?w=400&h=300&fit=crop',
    topics: ['Permits', 'Restoration Techniques', 'Cost Estimates', 'Contractor Selection']
  },
  {
    id: 5,
    title: 'Legal Checklist for Property Purchase',
    description: 'Essential legal checks and documents needed when buying property in Italy, with downloadable templates.',
    category: 'legal',
    type: 'checklist',
    readTime: '10 min',
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
    topics: ['Due Diligence', 'Contracts', 'Notary Process', 'Legal Requirements']
  },
  {
    id: 6,
    title: 'Living in Puglia: Expat Guide',
    description: 'Practical information for international residents, covering healthcare, schools, transportation, and daily life.',
    category: 'living',
    type: 'guide',
    readTime: '25 min',
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400&h=300&fit=crop',
    topics: ['Healthcare', 'Education', 'Transportation', 'Community']
  },
  {
    id: 7,
    title: 'Masseria Investment Opportunities',
    description: 'Analysis of the masseria market in Puglia, including renovation costs and potential returns from agritourism.',
    category: 'investment',
    type: 'report',
    readTime: '30 min',
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=400&h=300&fit=crop',
    topics: ['Market Analysis', 'Renovation Costs', 'Agritourism', 'Investment Returns']
  },
  {
    id: 8,
    title: 'First-Time Buyer\'s Checklist',
    description: 'Essential steps and considerations for first-time property buyers in Puglia, with timeline and cost breakdown.',
    category: 'buying',
    type: 'checklist',
    readTime: '8 min',
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=400&h=300&fit=crop',
    topics: ['Timeline', 'Budget Planning', 'Documentation', 'Key Decisions']
  }
]

const featuredGuides = [
  {
    title: 'Getting Started',
    description: 'New to buying property in Italy? Start here.',
    icon: Home,
    link: '/resources/getting-started',
    color: 'bg-blue-500'
  },
  {
    title: 'Legal & Tax Center',
    description: 'Navigate Italian property law with confidence.',
    icon: Shield,
    link: '/resources/legal-tax',
    color: 'bg-green-500'
  },
  {
    title: 'Investment Tools',
    description: 'Calculate ROI and analyze market trends.',
    icon: Calculator,
    link: '/resources/investment-tools',
    color: 'bg-purple-500'
  },
  {
    title: 'Ask an Expert',
    description: 'Get answers from property professionals.',
    icon: Briefcase,
    link: '/resources/ask-expert',
    color: 'bg-orange-500'
  }
]

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPremium = !showPremiumOnly || resource.isPremium
    return matchesCategory && matchesSearch && matchesPremium
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'tool': return <Calculator className="w-4 h-4" />
      case 'checklist': return <FileText className="w-4 h-4" />
      case 'report': return <TrendingUp className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Resources & Guides
          </h1>
          <p className="text-xl text-center text-blue-100 mb-8 max-w-3xl mx-auto">
            Expert guidance and tools to help you navigate your Puglia property journey with confidence
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl p-2">
              <div className="flex items-center">
                <Search className="w-5 h-5 text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder="Search guides, tools, and resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {featuredGuides.map((guide, index) => (
              <Link
                key={index}
                href={guide.link}
                className="group bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 ${guide.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <guide.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sm text-gray-600">{guide.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <nav className="space-y-2">
                  {resourceCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <category.icon className="w-4 h-4" />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPremiumOnly}
                      onChange={(e) => setShowPremiumOnly(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Premium content only</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Resources Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredResources.length} Resources Available
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {filteredResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={resource.image}
                        alt={resource.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {resource.isPremium && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                          PREMIUM
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          {getTypeIcon(resource.type)}
                          <span className="capitalize">{resource.type}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {resource.readTime}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {resource.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {resource.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {resource.topics.map((topic, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/resources/${resource.id}`}
                        className={`inline-flex items-center gap-2 font-semibold transition-colors ${
                          resource.isPremium
                            ? 'text-yellow-600 hover:text-yellow-700'
                            : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        {resource.isPremium ? 'Unlock with Premium' : 'Read More'}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('all')
                      setShowPremiumOnly(false)
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Newsletter CTA */}
              <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
                <p className="text-lg mb-6">
                  Get the latest guides and market insights delivered to your inbox
                </p>
                <form className="flex gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
