'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  Menu, X, Search, Heart, User, LogOut, Home, MapPin, 
  Users, BookOpen, CreditCard, TrendingUp, Bell, Settings,
  ChevronDown
} from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userMode, setUserMode] = useState<'buyer' | 'owner'>('buyer')
  const [subscriptionTier, setSubscriptionTier] = useState<string>('free')
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Get user and mode
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_mode, subscription_tier')
          .eq('id', user.id)
          .single()
        
        if (profile?.user_mode) {
          setUserMode(profile.user_mode)
        }
        if (profile?.subscription_tier) {
          setSubscriptionTier(profile.subscription_tier)
        }
      }
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const buyerNavItems = [
    { name: 'Search Properties', href: '/search', icon: Search },
    { name: 'Professionals', href: '/professionals', icon: Users },
    { name: 'Resources', href: '/resources', icon: BookOpen },
    { name: 'Pricing', href: '/pricing', icon: CreditCard },
  ]

  const ownerNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Properties', href: '/properties', icon: MapPin },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'Documents', href: '/documents', icon: BookOpen },
  ]

  const navItems = userMode === 'buyer' ? buyerNavItems : ownerNavItems

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">InvestiScope</span>
              {subscriptionTier !== 'free' && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  subscriptionTier === 'premium' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {subscriptionTier.toUpperCase()}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Mode Switcher */}
            {user && (
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setUserMode('buyer')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    userMode === 'buyer'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Buyer
                </button>
                <button
                  onClick={() => setUserMode('owner')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    userMode === 'owner'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Owner
                </button>
              </div>
            )}

            {/* Wishlist */}
            {user && userMode === 'buyer' && (
              <Link
                href="/wishlist"
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  3
                </span>
              </Link>
            )}

            {/* Notifications */}
            {user && (
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4 hidden md:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        {subscriptionTier === 'free' ? 'Free Account' : `${subscriptionTier} Plan`}
                      </p>
                    </div>
                    
                    <Link
                      href="/account/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    
                    <Link
                      href="/account/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    
                    {subscriptionTier === 'free' && (
                      <Link
                        href="/pricing"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium"
                      >
                        <TrendingUp className="w-4 h-4" />
                        Upgrade to Premium
                      </Link>
                    )}
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left border-t"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-gray-900 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-2">
            {/* Mode Switcher Mobile */}
            {user && (
              <div className="flex items-center bg-gray-100 rounded-lg p-1 mb-4">
                <button
                  onClick={() => setUserMode('buyer')}
                  className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                    userMode === 'buyer'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Buyer Mode
                </button>
                <button
                  onClick={() => setUserMode('owner')}
                  className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                    userMode === 'owner'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Owner Mode
                </button>
              </div>
            )}

            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}

            {!user && (
              <div className="pt-4 space-y-2 border-t">
                <Link
                  href="/auth/signin"
                  className="block px-4 py-3 text-center text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-4 py-3 text-center bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
