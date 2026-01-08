'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [pathname])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span className="text-xl font-bold gradient-text">WriteFlow AI</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === '/dashboard'
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/tools/blog"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname.startsWith('/tools')
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Tools
                    </Link>
                    <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                      <span className="text-sm text-gray-500">{user.email}</span>
                      {user.subscriptionStatus === 'active' && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          Pro
                        </span>
                      )}
                      <button
                        onClick={handleLogout}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/pricing"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      Pricing
                    </Link>
                    <Link
                      href="/login"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                    >
                      Get Started Free
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2">
          <div className="px-4 space-y-2">
            {user ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  Dashboard
                </Link>
                <Link href="/tools/blog" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  Tools
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/pricing" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  Pricing
                </Link>
                <Link href="/login" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  Login
                </Link>
                <Link href="/register" className="block px-3 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md text-center">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
