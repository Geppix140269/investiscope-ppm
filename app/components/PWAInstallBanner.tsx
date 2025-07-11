// app/components/PWAInstallBanner.tsx
'use client'

import { useState, useEffect } from 'react'
import { usePWA } from '@/lib/hooks/usePWA'

export default function PWAInstallBanner() {
  const { isInstallable, installPWA, isOnline } = usePWA()
  const [dismissed, setDismissed] = useState(false)

  if (!isInstallable || dismissed) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold">Install InvestiScope PPM</p>
            <p className="text-sm text-white/80">Access your properties offline, anytime!</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={installPWA}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Install App
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-all"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  )
}

// Online/Offline indicator
export function OnlineStatusIndicator() {
  const { isOnline } = usePWA()
  const [showOfflineAlert, setShowOfflineAlert] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setShowOfflineAlert(true)
      const timer = setTimeout(() => setShowOfflineAlert(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isOnline])

  if (isOnline || !showOfflineAlert) return null

  return (
    <div className="fixed top-16 left-0 right-0 bg-yellow-500 text-white p-2 text-center z-40">
      <p className="text-sm font-medium">
        You&apos;re offline - Some features may be limited
      </p>
    </div>
  )
}
