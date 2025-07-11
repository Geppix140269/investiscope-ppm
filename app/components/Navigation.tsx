// File: app/components/Navigation.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function Navigation() {
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Properties', href: '/properties' },
    { name: 'Projects', href: '/projects' },
    { name: 'Documents', href: '/documents' },
    { name: 'Team', href: '/team' },
  ]

  // Don't show navigation on auth pages
  const authPages = ['/login', '/register']
  const isAuthPage = authPages.includes(pathname)
  const isHomePage = pathname === '/'

  if (loading) return null

  return (
    <nav className={`${isHomePage ? 'absolute' : 'fixed'} w-full top-0 z-50 ${isHomePage ? 'bg-transparent' : 'bg-white border-b border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/Logo_InvestiScope.png"
                alt="InvestiScope Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <Image
                src="/logo_investiscope_tm_letters.png"
                alt="InvestiScope"
                width={150}
                height={30}
                className="h-7 w-auto"
              />
            </Link>

            {/* Desktop Navigation - Only show if logged in */}
            {user && !isAuthPage && !isHomePage && (
              <div className="hidden md:ml-8 md:flex md:space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      pathname === item.href
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center">
            {user && !isAuthPage ? (
              <div className="flex items-center space-x-4">
                <span className="hidden md:block text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={signOut}
                  className={`${isHomePage ? 'bg-white text-gray-700 hover:bg-gray-100' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} px-4 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                  Sign Out
                </button>
              </div>
            ) : !isAuthPage ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className={`${isHomePage ? 'text-gray-700 hover:text-gray-900' : 'text-gray-600 hover:text-gray-900'} px-4 py-2 rounded-md text-sm font-medium`}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={`${isHomePage ? 'bg-gray-900 hover:bg-gray-800 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} px-4 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                  Get Started
                </Link>
              </div>
            ) : null}

            {/* Mobile menu button */}
            {user && !isAuthPage && !isHomePage && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="ml-4 md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && user && !isAuthPage && !isHomePage && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="px-3 py-2 text-sm text-gray-600">{user.email}</div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  signOut()
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
