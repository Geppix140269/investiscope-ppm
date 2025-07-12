// lib/subscription.ts

export type SubscriptionTier = 'free' | 'premium' | 'professional'

export interface SubscriptionFeatures {
  // Property Features
  maxSavedProperties: number
  advancedSearch: boolean
  propertyComparison: boolean
  propertyValuation: boolean
  exclusiveListings: boolean
  
  // Analytics Features
  marketAnalytics: boolean
  investmentCalculator: boolean
  downloadableReports: boolean
  
  // Communication Features
  directMessaging: boolean
  prioritySupport: boolean
  emailAlerts: 'weekly' | 'daily' | 'realtime'
  
  // Professional Features
  listProperties: boolean
  leadManagement: boolean
  teamCollaboration: boolean
  apiAccess: boolean
  customBranding: boolean
  whitelabelReports: boolean
}

export const SUBSCRIPTION_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    maxSavedProperties: 10,
    advancedSearch: false,
    propertyComparison: false,
    propertyValuation: false,
    exclusiveListings: false,
    marketAnalytics: false,
    investmentCalculator: false,
    downloadableReports: false,
    directMessaging: false,
    prioritySupport: false,
    emailAlerts: 'weekly',
    listProperties: false,
    leadManagement: false,
    teamCollaboration: false,
    apiAccess: false,
    customBranding: false,
    whitelabelReports: false,
  },
  premium: {
    maxSavedProperties: Infinity,
    advancedSearch: true,
    propertyComparison: true,
    propertyValuation: true,
    exclusiveListings: true,
    marketAnalytics: true,
    investmentCalculator: true,
    downloadableReports: true,
    directMessaging: true,
    prioritySupport: true,
    emailAlerts: 'realtime',
    listProperties: false,
    leadManagement: false,
    teamCollaboration: false,
    apiAccess: false,
    customBranding: false,
    whitelabelReports: false,
  },
  professional: {
    maxSavedProperties: Infinity,
    advancedSearch: true,
    propertyComparison: true,
    propertyValuation: true,
    exclusiveListings: true,
    marketAnalytics: true,
    investmentCalculator: true,
    downloadableReports: true,
    directMessaging: true,
    prioritySupport: true,
    emailAlerts: 'realtime',
    listProperties: true,
    leadManagement: true,
    teamCollaboration: true,
    apiAccess: true,
    customBranding: true,
    whitelabelReports: true,
  },
}

// React Hook for feature gating
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useSubscription() {
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setSubscriptionTier('free')
          setLoading(false)
          return
        }

        // Fetch user's subscription from your database
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier, subscription_status')
          .eq('id', user.id)
          .single()

        if (profile && profile.subscription_status === 'active') {
          setSubscriptionTier(profile.subscription_tier as SubscriptionTier || 'free')
        } else {
          setSubscriptionTier('free')
        }
      } catch (error) {
        console.error('Error fetching subscription:', error)
        setSubscriptionTier('free')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  const hasFeature = (feature: keyof SubscriptionFeatures): boolean => {
    const features = SUBSCRIPTION_FEATURES[subscriptionTier]
    return features[feature] === true || 
           (typeof features[feature] === 'number' && features[feature] > 0) ||
           (typeof features[feature] === 'string' && features[feature] !== '')
  }

  const getFeatureLimit = (feature: keyof SubscriptionFeatures): number | string | boolean => {
    return SUBSCRIPTION_FEATURES[subscriptionTier][feature]
  }

  const canUpgrade = subscriptionTier !== 'professional'

  return {
    subscriptionTier,
    loading,
    hasFeature,
    getFeatureLimit,
    canUpgrade,
    features: SUBSCRIPTION_FEATURES[subscriptionTier],
  }
}

// Component for gating features
import React from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'

interface FeatureGateProps {
  feature: keyof SubscriptionFeatures
  children: React.ReactNode
  fallback?: React.ReactNode
  showUpgradePrompt?: boolean
}

export function FeatureGate({ 
  feature, 
  children, 
  fallback,
  showUpgradePrompt = true 
}: FeatureGateProps) {
  const { hasFeature, subscriptionTier } = useSubscription()

  if (hasFeature(feature)) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (showUpgradePrompt) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Premium Feature
        </h3>
        <p className="text-gray-600 mb-4">
          This feature is available for {subscriptionTier === 'free' ? 'Premium and Professional' : 'Professional'} subscribers.
        </p>
        <Link
          href="/pricing"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Upgrade Now
        </Link>
      </div>
    )
  }

  return null
}

// Utility function to check if user can perform action
export async function canUserPerformAction(
  userId: string,
  action: keyof SubscriptionFeatures
): Promise<boolean> {
  const supabase = createClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_status')
    .eq('id', userId)
    .single()

  if (!profile || profile.subscription_status !== 'active') {
    return SUBSCRIPTION_FEATURES.free[action] === true
  }

  const tier = profile.subscription_tier as SubscriptionTier || 'free'
  return SUBSCRIPTION_FEATURES[tier][action] === true
}

// Example usage in a component:
/*
export function PropertyComparisonTool() {
  return (
    <FeatureGate feature="propertyComparison">
      <div>
        {/* Your comparison tool UI here */}
      </div>
    </FeatureGate>
  )
}

export function SavePropertyButton({ propertyId }: { propertyId: string }) {
  const { hasFeature, getFeatureLimit } = useSubscription()
  const [savedCount, setSavedCount] = useState(0)
  
  const maxSaved = getFeatureLimit('maxSavedProperties') as number
  const canSave = savedCount < maxSaved
  
  if (!canSave && !hasFeature('maxSavedProperties')) {
    return (
      <button className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed">
        Limit Reached ({maxSaved} properties)
      </button>
    )
  }
  
  return (
    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
      Save Property
    </button>
  )
}
*/
