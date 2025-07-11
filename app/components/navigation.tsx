'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Navigation() {
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Properties', href: '/properties', icon: '🏠' },
    { name: 'Projects', href: '/projects', icon: '📋' },
    { name: 'Documents', href: '/documents', icon: '📄' },
    { name: 'Team', href: '/team', icon: '👥' },
  ]

  const tools = [
    { name: 'Grant Calculator', href: 'https://investiscope.net/calculator', external: true, icon: '🧮' },
    { name: 'Property Survey', href: 'https://investiscope.net/surveys', external: true, icon: '🔍' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <Link href={user ? '/dashboard' : '/'} className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                InvestiScope PPM
              </h1>
            </Link>

            {/* Desktop Navigation */}
            {user && (
              <div className="hidden md:ml-8 md:flex md:space-x-1">
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
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
                
                {/* Dropdown for Tools */}
                <div className="relative group">
                  <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    <span className="mr-2">🛠️</span>
                    Tools
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {tools.map((tool) => (
                      <a
                        key={tool.name}
                        href={tool.href}
                        target={tool.external ? '_blank' : undefined}
                        rel={tool.external ? 'noopener noreferrer' : undefined}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        <span className="mr-3">{tool.icon}</span>
                        {tool.name}
                        {tool.external && (
                          <svg className="ml-auto w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="hidden md:block text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={signOut}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
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
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user && navigation.map((item) => (
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
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            {user && (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                {tools.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.href}
                    target={tool.external ? '_blank' : undefined}
                    rel={tool.external ? 'noopener noreferrer' : undefined}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="mr-2">{tool.icon}</span>
                    {tool.name}
                    {tool.external && <span className="ml-1 text-xs">↗</span>}
                  </a>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
