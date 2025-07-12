// File: app/pricing/page.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Zap, Shield, Globe, HeadphonesIcon, TrendingUp, Users } from 'lucide-react'

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for exploring the market',
    price: 0,
    currency: '€',
    interval: 'forever',
    popular: false,
    features: [
      { text: 'Browse all property listings', included: true },
      { text: 'Save up to 10 properties', included: true },
      { text: 'Basic search filters', included: true },
      { text: 'Email alerts (weekly)', included: true },
      { text: 'View professional contacts', included: true },
      { text: 'Access to guides', included: true },
      { text: 'Advanced analytics', included: false },
      { text: 'Priority support', included: false },
      { text: 'Direct messaging', included: false },
      { text: 'Property valuation tools', included: false },
      { text: 'Investment calculator', included: false },
      { text: 'Exclusive listings', included: false }
    ],
    cta: 'Start Free',
    ctaLink: '/auth/signup'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For serious buyers and investors',
    price: 19,
    currency: '€',
    interval: 'month',
    popular: true,
    stripeProductId: 'price_premium_monthly', // For future use
    features: [
      { text: 'Everything in Basic', included: true },
      { text: 'Unlimited saved properties', included: true },
      { text: 'Advanced search & filters', included: true },
      { text: 'Real-time email alerts', included: true },
      { text: 'Property comparison tool', included: true },
      { text: 'Investment calculator', included: true },
      { text: 'Market analytics dashboard', included: true },
      { text: 'Direct messaging to agents', included: true },
      { text: 'Priority customer support', included: true },
      { text: 'Downloadable reports', included: true },
      { text: 'Early access to new listings', included: true },
      { text: 'White-label reports', included: false }
    ],
    cta: 'Start 14-Day Trial',
    ctaAction: 'premium'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For agents and property managers',
    price: 49,
    currency: '€',
    interval: 'month',
    popular: false,
    stripeProductId: 'price_professional_monthly', // For future use
    features: [
      { text: 'Everything in Premium', included: true },
      { text: 'List unlimited properties', included: true },
      { text: 'Professional profile page', included: true },
      { text: 'Lead management system', included: true },
      { text: 'White-label reports', included: true },
      { text: 'API access', included: true },
      { text: 'Team collaboration (5 users)', included: true },
      { text: 'Custom branding', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Training and onboarding', included: true },
      { text: 'Commission tracking', included: true }
    ],
    cta: 'Contact Sales',
    ctaAction: 'professional'
  }
]

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (planId: string, stripeProductId?: string) => {
    if (!stripeProductId) {
      // Handle free plan or contact sales
      if (planId === 'basic') {
        window.location.href = '/auth/signup'
      } else if (planId === 'professional') {
        window.location.href = '/contact?type=sales'
      }
      return
    }

    setLoading(planId)

    // For now, just redirect to a coming soon page
    // In production, this would integrate with Stripe
    alert('Payment integration coming soon! For now, please contact us at support@investiscope.net')
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Start free and upgrade as you grow. All plans include access to our comprehensive Puglia property database.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-blue-800/50 rounded-lg p-1">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingInterval === 'monthly'
                  ? 'bg-white text-blue-700'
                  : 'text-white hover:text-blue-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingInterval === 'yearly'
                  ? 'bg-white text-blue-700'
                  : 'text-white hover:text-blue-100'
              }`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const displayPrice = billingInterval === 'yearly' && plan.price > 0
                ? Math.floor(plan.price * 12 * 0.8) // 20% discount for yearly
                : plan.price

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                    plan.popular ? 'ring-2 ring-blue-600 relative' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">{plan.currency}{displayPrice}</span>
                      {plan.price > 0 && (
                        <span className="text-gray-600">
                          /{billingInterval === 'yearly' ? 'year' : 'month'}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleCheckout(plan.id, plan.stripeProductId)}
                      disabled={loading === plan.id}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                        plan.popular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      } ${loading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading === plan.id ? 'Processing...' : plan.cta}
                    </button>

                    <div className="mt-8 space-y-4">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${
                            feature.included ? 'text-gray-700' : 'text-gray-400'
                          }`}>
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose InvestiScope?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                Bank-level security with SSL encryption and secure payment processing
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">International Support</h3>
              <p className="text-gray-600">
                Multi-language support and dedicated assistance for international buyers
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Market Insights</h3>
              <p className="text-gray-600">
                Real-time market data and analytics to make informed investment decisions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Premium plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, and PayPal through our secure payment processing.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Can I cancel my subscription?</h3>
              <p className="text-gray-600">
                You can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl mb-8">
            Our team is here to help you choose the right plan for your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Sales
            </Link>
            <Link
              href="/resources/pricing-guide"
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors"
            >
              View Pricing Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
