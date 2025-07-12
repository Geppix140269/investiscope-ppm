// File: app/dashboard/buyer-dashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { 
  Search, FileText, Calculator, Users, Shield, TrendingUp, 
  CheckCircle, Circle, Lock, Star, ArrowRight, Book, 
  MessageCircle, Calendar, Euro, Home, Sparkles, AlertCircle,
  Coffee, Target, Map, ChevronRight
} from 'lucide-react'

interface DashboardProps {
  user: any
}

export default function BuyerDashboard({ user }: DashboardProps) {
  const [properties, setProperties] = useState<any[]>([])
  const [subscription, setSubscription] = useState<'free' | 'dreamer' | 'buyer' | 'owner'>('free')
  const [journeyPhase, setJourneyPhase] = useState<'dreaming' | 'searching' | 'viewing' | 'offering' | 'closing'>('dreaming')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Journey steps with SaaS gates
  const journeySteps = [
    {
      id: 'learn',
      phase: 'dreaming',
      title: 'Learn About Italian Property',
      description: 'Understand the market, regions, and property types',
      icon: <Book className="w-5 h-5" />,
      completed: false,
      locked: false,
      action: '/resources',
      cta: 'Start Learning'
    },
    {
      id: 'calculate',
      phase: 'dreaming',
      title: 'Calculate True Costs',
      description: 'Discover all fees, taxes, and hidden expenses',
      icon: <Calculator className="w-5 h-5" />,
      completed: false,
      locked: subscription === 'free',
      action: '/calculator',
      cta: 'Calculate Costs'
    },
    {
      id: 'search',
      phase: 'searching',
      title: 'Build Your Wishlist',
      description: 'Save and organize properties you love',
      icon: <Search className="w-5 h-5" />,
      completed: properties.length > 0,
      locked: false,
      action: '/search',
      cta: 'Browse Properties'
    },
    {
      id: 'professionals',
      phase: 'searching',
      title: 'Connect with Professionals',
      description: 'Find English-speaking notaries, geometras, and agents',
      icon: <Users className="w-5 h-5" />,
      completed: false,
      locked: subscription === 'free',
      action: '/professionals',
      cta: 'Find Professionals'
    },
    {
      id: 'documents',
      phase: 'viewing',
      title: 'Document Checklist',
      description: 'Know exactly what documents you need',
      icon: <FileText className="w-5 h-5" />,
      completed: false,
      locked: subscription === 'free',
      action: '/checklist',
      cta: 'View Checklist'
    },
    {
      id: 'viewing',
      phase: 'viewing',
      title: 'Schedule Viewings',
      description: 'Organize property visits and track feedback',
      icon: <Calendar className="w-5 h-5" />,
      completed: properties.some(p => p.status === 'viewing'),
      locked: false,
      action: '/wishlist',
      cta: 'Manage Viewings'
    },
    {
      id: 'offer',
      phase: 'offering',
      title: 'Make an Offer',
      description: 'Understand the offer process and negotiation',
      icon: <Euro className="w-5 h-5" />,
      completed: properties.some(p => p.status === 'offer'),
      locked: subscription !== 'buyer',
      action: '/resources/making-offers',
      cta: 'Learn More'
    },
    {
      id: 'purchase',
      phase: 'closing',
      title: 'Complete Purchase',
      description: 'Navigate notary, contracts, and final steps',
      icon: <Shield className="w-5 h-5" />,
      completed: false,
      locked: subscription !== 'buyer',
      action: '/resources/purchase-process',
      cta: 'Purchase Guide'
    }
  ]

  useEffect(() => {
    fetchUserData()
  }, [])

  async function fetchUserData() {
    // Fetch user's wishlist properties
    const { data: props } = await supabase
      .from('properties')
      .select('*')
      .neq('status', 'owned')

    if (props) {
      setProperties(props)
      // Determine journey phase based on property statuses
      if (props.some(p => p.status === 'offer')) {
        setJourneyPhase('offering')
      } else if (props.some(p => p.status === 'viewing')) {
        setJourneyPhase('viewing')
      } else if (props.length > 0) {
        setJourneyPhase('searching')
      }
    }

    // Check subscription status (mock for now)
    // In production, check Stripe or payment provider
    setSubscription('free') // Would check actual subscription

    setLoading(false)
  }

  const inspirationContent = [
    {
      title: "Why Puglia?",
      description: "Discover why investors are flocking to Italy's hidden gem",
      image: "🏖️",
      link: "/resources/why-puglia"
    },
    {
      title: "Success Stories",
      description: "How Sarah & James found their dream trullo",
      image: "🏡",
      link: "/resources/success-stories"
    },
    {
      title: "Investment Calculator",
      description: "See potential returns on Italian property",
      image: "📈",
      link: "/calculator/roi"
    }
  ]

  const urgentTasks = [
    {
      title: "Complete your profile",
      description: "Help us personalize your experience",
      priority: "high",
      action: "/profile"
    },
    {
      title: "Set your budget range",
      description: "Get relevant property recommendations",
      priority: "medium",
      action: "/preferences"
    },
    {
      title: "Verify your email",
      description: "Unlock all features",
      priority: "high",
      action: "/verify-email"
    }
  ]

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section with CTA */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-light mb-2">
            Welcome to Your Italian Property Journey, {user.email?.split('@')[0]}!
          </h1>
          <p className="text-xl text-white/90 mb-6">
            You're {properties.length === 0 ? 'just getting started' : `tracking ${properties.length} properties`}. 
            Let's make your dream a reality.
          </p>
          
          {subscription === 'free' && (
            <div className="bg-white/20 backdrop-blur rounded-xl p-6 border border-white/30">
              <div className="flex items-start gap-4">
                <Sparkles className="w-8 h-8 text-yellow-300 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Unlock Your Full Journey</h3>
                  <p className="text-white/90 mb-4">
                    You're on the free plan. Upgrade to access cost calculators, document checklists, 
                    professional connections, and priority support.
                  </p>
                  <div className="flex gap-3">
                    <Link
                      href="/pricing"
                      className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                      View Plans
                    </Link>
                    <Link
                      href="/resources/free-guide"
                      className="border border-white/50 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors"
                    >
                      Get Free Guide
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Journey Progress */}
      <div>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Map className="w-5 h-5" />
          Your Journey to Italian Property Ownership
        </h2>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="text-sm font-medium">
                {Math.round((journeySteps.filter(s => s.completed).length / journeySteps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(journeySteps.filter(s => s.completed).length / journeySteps.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {journeySteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  step.completed 
                    ? 'border-green-200 bg-green-50' 
                    : step.locked 
                    ? 'border-gray-200 bg-gray-50 opacity-75' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : step.locked
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-indigo-100 text-indigo-600'
                }`}>
                  {step.completed ? <CheckCircle className="w-5 h-5" /> : 
                   step.locked ? <Lock className="w-5 h-5" /> : step.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    {step.title}
                    {step.locked && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        Requires {step.phase === 'offering' || step.phase === 'closing' ? 'Buyer' : 'Dreamer'} Plan
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>

                {!step.locked && (
                  <Link
                    href={step.action}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    {step.cta}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Urgent Tasks */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quick Wins
            </h2>
            <div className="bg-white rounded-xl shadow-sm divide-y">
              {urgentTasks.map((task, index) => (
                <Link
                  key={index}
                  href={task.action}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      task.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Your Properties Summary */}
          {properties.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Your Wishlist
                </h2>
                <Link href="/wishlist" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  View All →
                </Link>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                    <p className="text-sm text-gray-600">Saved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {properties.filter(p => p.status === 'viewing').length}
                    </p>
                    <p className="text-sm text-gray-600">Viewings</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {properties.filter(p => p.status === 'offer').length}
                    </p>
                    <p className="text-sm text-gray-600">Offers</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Inspiration & Resources */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            Get Inspired
          </h2>
          <div className="space-y-4">
            {inspirationContent.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="block bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{item.image}</div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Support */}
          <div className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Need Help?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Our team speaks English and Italian. We're here to guide you.
            </p>
            <div className="space-y-2">
              <Link
                href="/support"
                className="block w-full text-center bg-white text-gray-900 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Contact Support
              </Link>
              {subscription !== 'free' && (
                <a
                  href="https://wa.me/390801234567"
                  className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  WhatsApp Us
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
