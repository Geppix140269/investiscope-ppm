// File: app/dashboard/buyer-dashboard.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search, Heart, Calculator, FileText, Users, TrendingUp, 
  CheckCircle, Clock, Lock, ChevronRight, Star, Globe,
  Home, MapPin, Phone, Mail, Calendar, DollarSign
} from 'lucide-react'

interface JourneyStep {
  id: number
  title: string
  description: string
  icon: any
  completed: boolean
  current: boolean
  locked: boolean
  link?: string
}

export default function BuyerDashboard() {
  const [userTier] = useState<'free' | 'dreamer' | 'buyer' | 'owner'>('free')
  
  const journeySteps: JourneyStep[] = [
    {
      id: 1,
      title: 'Dream & Explore',
      description: 'Browse Italian regions and property types',
      icon: Globe,
      completed: true,
      current: false,
      locked: false,
      link: '/regions'
    },
    {
      id: 2,
      title: 'Set Your Budget',
      description: 'Use our calculator to understand true costs',
      icon: Calculator,
      completed: true,
      current: false,
      locked: false,
      link: '/calculator'
    },
    {
      id: 3,
      title: 'Search Properties',
      description: 'Find properties that match your criteria',
      icon: Search,
      completed: true,
      current: true,
      locked: false,
      link: '/search'
    },
    {
      id: 4,
      title: 'Save Favorites',
      description: 'Build your wishlist and compare options',
      icon: Heart,
      completed: false,
      current: false,
      locked: false,
      link: '/wishlist'
    },
    {
      id: 5,
      title: 'Connect with Agents',
      description: 'Work with English-speaking professionals',
      icon: Users,
      completed: false,
      current: false,
      locked: userTier === 'free',
      link: '/professionals'
    },
    {
      id: 6,
      title: 'Schedule Viewings',
      description: 'Plan your property viewing trip',
      icon: Calendar,
      completed: false,
      current: false,
      locked: userTier === 'free',
      link: '/viewings'
    },
    {
      id: 7,
      title: 'Make an Offer',
      description: 'Navigate the Italian purchase process',
      icon: FileText,
      completed: false,
      current: false,
      locked: userTier !== 'buyer' && userTier !== 'owner',
      link: '/guides/making-offer'
    },
    {
      id: 8,
      title: 'Complete Purchase',
      description: 'From contract to keys in hand',
      icon: Home,
      completed: false,
      current: false,
      locked: userTier !== 'buyer' && userTier !== 'owner',
      link: '/guides/purchase-process'
    }
  ]

  const stats = {
    savedProperties: 3,
    scheduledViewings: 0,
    documentsUploaded: 0,
    daysOnPlatform: 7
  }

  const quickWins = [
    {
      title: 'Complete Your Profile',
      description: 'Add your preferences to get personalized recommendations',
      completed: false,
      link: '/profile'
    },
    {
      title: 'Download Buyer\'s Checklist',
      description: 'Essential steps for buying property in Italy',
      completed: true,
      link: '/resources/checklist'
    },
    {
      title: 'Join Our Community',
      description: 'Connect with other international buyers',
      completed: false,
      link: '/community'
    }
  ]

  const featuredResources = [
    {
      title: 'True Cost Calculator',
      description: 'Understand all costs involved in buying Italian property',
      icon: Calculator,
      premium: false,
      link: '/calculator'
    },
    {
      title: 'Legal Guide',
      description: 'Navigate Italian property law with confidence',
      icon: FileText,
      premium: true,
      link: '/guides/legal'
    },
    {
      title: 'Region Comparison',
      description: 'Compare different Italian regions for investment',
      icon: TrendingUp,
      premium: true,
      link: '/tools/region-comparison'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Italian Property Journey</h1>
              <p className="text-gray-600 mt-1">Track your progress from dream to ownership</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="font-semibold text-gray-900 capitalize">{userTier} Plan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saved Properties</p>
                <p className="text-2xl font-bold text-gray-900">{stats.savedProperties}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled Viewings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.scheduledViewings}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.documentsUploaded}</p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Days Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.daysOnPlatform}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Journey Progress */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Journey Progress</h2>
            
            <div className="space-y-4">
              {journeySteps.map((step, index) => (
                <div key={step.id} className="relative">
                  {index < journeySteps.length - 1 && (
                    <div className={`absolute left-6 top-12 w-0.5 h-16 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                  
                  <div className={`flex items-start space-x-4 p-4 rounded-lg transition-all ${
                    step.current ? 'bg-blue-50 border-2 border-blue-500' : 
                    step.locked ? 'opacity-60' : 
                    'hover:bg-gray-50'
                  }`}>
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-500 text-white' :
                      step.current ? 'bg-blue-500 text-white' :
                      step.locked ? 'bg-gray-300 text-gray-500' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : step.locked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${
                          step.current ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {step.title}
                        </h3>
                        {step.current && (
                          <span className="text-sm font-medium text-blue-600">Current Step</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      {!step.locked && step.link && (
                        <Link 
                          href={step.link}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-2"
                        >
                          Continue <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      )}
                      {step.locked && (
                        <p className="text-sm text-orange-600 mt-2">
                          🔒 Upgrade to {step.id <= 6 ? 'Dreamer' : 'Buyer'} plan to unlock
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Wins & Resources */}
          <div className="space-y-6">
            {/* Quick Wins */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Wins</h2>
              <div className="space-y-3">
                {quickWins.map((win, index) => (
                  <Link
                    key={index}
                    href={win.link}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        win.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {win.completed && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{win.title}</h4>
                        <p className="text-sm text-gray-600">{win.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured Resources */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Resources</h2>
              <div className="space-y-3">
                {featuredResources.map((resource, index) => (
                  <Link
                    key={index}
                    href={resource.link}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <resource.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-900">
                          {resource.title}
                          {resource.premium && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              Premium
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600">{resource.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upgrade CTA */}
            {userTier === 'free' && (
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Unlock Your Full Journey</h3>
                <p className="text-sm mb-4 opacity-90">
                  Get access to all tools, guides, and professional support
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  View Plans <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-gray-900">You saved &quot;Trullo in Alberobello&quot; to your wishlist</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-900">You searched for properties in Puglia</p>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-900">You completed the budget calculator</p>
                <p className="text-sm text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inspiration Section */}
        <div className="mt-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg shadow p-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              <Star className="w-8 h-8 text-yellow-500 inline mr-2" />
              Today&apos;s Inspiration
            </h2>
            <blockquote className="text-lg text-gray-700 italic mb-4">
              &quot;Moving to Italy was the best decision we ever made. The InvestiScope team guided us through every step, from finding our dream trullo to navigating the purchase process. Now we&apos;re living la dolce vita!&quot;
            </blockquote>
            <p className="text-gray-600">— Sarah & James, UK → Puglia (2024)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
