'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'

const features = {
  free: [
    '5 generations per month',
    'All 6 writing tools',
    'Basic support',
    'Standard generation speed',
  ],
  pro: [
    'Unlimited generations',
    'All 6 writing tools',
    'Priority support',
    'Faster generation speed',
    'Early access to new features',
    'Export to multiple formats',
  ],
}

export default function PricingPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const canceled = searchParams.get('canceled')

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch {
      // Not logged in
    }
  }

  const handleSubscribe = async () => {
    if (!user) {
      window.location.href = '/register'
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to start checkout. Please try again.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isSubscribed = user?.subscriptionStatus === 'active'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Canceled message */}
        {canceled && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-center">
            Checkout was canceled. No charges were made.
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free, upgrade when you need more. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Free</h2>
              <p className="text-gray-600 mt-1">Perfect for trying out</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-gray-500">/month</span>
            </div>

            <ul className="space-y-3 mb-8">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {user ? (
              <Link
                href="/dashboard"
                className="block w-full py-3 text-center border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/register"
                className="block w-full py-3 text-center border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Get Started Free
              </Link>
            )}
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-primary-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Pro</h2>
              <p className="text-gray-600 mt-1">For power users</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$9.99</span>
              <span className="text-gray-500">/month</span>
            </div>

            <ul className="space-y-3 mb-8">
              {features.pro.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-primary-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {isSubscribed ? (
              <button
                disabled
                className="w-full py-3 bg-green-100 text-green-700 rounded-lg font-semibold"
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Upgrade to Pro'}
              </button>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens when I hit my free limit?
              </h3>
              <p className="text-gray-600">
                Once you've used your 5 free generations, you'll need to wait until next month or upgrade to Pro for unlimited access.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is my payment information secure?
              </h3>
              <p className="text-gray-600">
                Absolutely! We use Stripe for payment processing. We never store your card details on our servers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 7-day money-back guarantee. If you're not satisfied, contact us for a full refund.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
