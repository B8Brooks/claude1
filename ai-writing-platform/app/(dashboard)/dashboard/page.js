'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'

const tools = [
  {
    id: 'blog',
    name: 'Blog Post Generator',
    description: 'Create engaging, SEO-optimized blog posts',
    icon: '📝',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'email',
    name: 'Email Writer',
    description: 'Craft compelling emails that convert',
    icon: '📧',
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Generate viral social media content',
    icon: '📱',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'product',
    name: 'Product Descriptions',
    description: 'Write copy that sells products',
    icon: '🛍️',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: 'headline',
    name: 'Headline Generator',
    description: 'Create click-worthy headlines',
    icon: '📰',
    color: 'bg-red-100 text-red-600',
  },
  {
    id: 'rewrite',
    name: 'Content Rewriter',
    description: 'Improve and polish your content',
    icon: '✨',
    color: 'bg-yellow-100 text-yellow-600',
  },
]

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [billingLoading, setBillingLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        router.push('/login')
      }
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setBillingLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error opening billing portal:', error)
    } finally {
      setBillingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  const isSubscribed = user?.subscriptionStatus === 'active'
  const usagePercent = isSubscribed ? 0 : ((user?.monthlyUsage || 0) / 5) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 animate-fade-in">
            <p className="font-semibold">Welcome to Pro!</p>
            <p className="text-sm">You now have unlimited access to all AI writing tools.</p>
          </div>
        )}

        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600 mt-1">
            Choose a tool below to start creating content
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Plan</p>
                <p className="text-xl font-semibold text-gray-900">
                  {isSubscribed ? 'Pro' : 'Free'}
                </p>
              </div>
              {isSubscribed ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Active
                </span>
              ) : (
                <Link
                  href="/pricing"
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-200"
                >
                  Upgrade
                </Link>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Monthly Usage</p>
            {isSubscribed ? (
              <p className="text-xl font-semibold text-gray-900">Unlimited</p>
            ) : (
              <>
                <p className="text-xl font-semibold text-gray-900">
                  {user?.monthlyUsage || 0} / 5
                </p>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 transition-all"
                    style={{ width: `${usagePercent}%` }}
                  ></div>
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Account</p>
            <p className="text-xl font-semibold text-gray-900 truncate">{user?.email}</p>
            {isSubscribed && (
              <button
                onClick={handleManageBilling}
                disabled={billingLoading}
                className="mt-2 text-sm text-primary-600 hover:underline disabled:opacity-50"
              >
                {billingLoading ? 'Loading...' : 'Manage billing'}
              </button>
            )}
          </div>
        </div>

        {/* Tools grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Writing Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover block"
              >
                <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center text-2xl mb-4`}>
                  {tool.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {tool.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Upgrade CTA for free users */}
        {!isSubscribed && (
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  Upgrade to Pro for Unlimited Access
                </h3>
                <p className="text-primary-100">
                  Get unlimited generations, priority support, and advanced features.
                </p>
              </div>
              <Link
                href="/pricing"
                className="mt-4 md:mt-0 px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
