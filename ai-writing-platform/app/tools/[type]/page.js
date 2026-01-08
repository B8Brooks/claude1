'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const toolConfig = {
  blog: {
    name: 'Blog Post Generator',
    description: 'Create engaging, SEO-optimized blog posts',
    icon: '📝',
    placeholder: 'Enter your blog topic, target audience, and any specific points to cover...\n\nExample: Write a blog post about "10 productivity tips for remote workers" targeting professionals who work from home. Include practical tips they can implement immediately.',
  },
  email: {
    name: 'Email Writer',
    description: 'Craft compelling emails that convert',
    icon: '📧',
    placeholder: 'Describe the email purpose, recipient, and key message...\n\nExample: Write a cold email to potential B2B clients introducing our project management software. The tone should be professional but friendly, and focus on time-saving benefits.',
  },
  social: {
    name: 'Social Media Content',
    description: 'Generate viral social media content',
    icon: '📱',
    placeholder: 'Enter your topic, platform (Twitter/LinkedIn/Instagram), and goal...\n\nExample: Create a LinkedIn post announcing our company milestone of reaching 10,000 customers. The tone should be celebratory but humble, thanking our customers and team.',
  },
  product: {
    name: 'Product Descriptions',
    description: 'Write copy that sells products',
    icon: '🛍️',
    placeholder: 'Enter product name, features, target audience, and unique selling points...\n\nExample: Write a description for a wireless noise-canceling headphone. Target audience: professionals and music enthusiasts. Key features: 40-hour battery, premium sound, comfortable for all-day wear.',
  },
  headline: {
    name: 'Headline Generator',
    description: 'Create click-worthy headlines',
    icon: '📰',
    placeholder: 'Enter your topic or article summary...\n\nExample: Generate headlines for an article about how AI is changing the job market in 2024, targeting job seekers and career changers.',
  },
  rewrite: {
    name: 'Content Rewriter',
    description: 'Improve and polish your content',
    icon: '✨',
    placeholder: 'Paste the content you want to improve...\n\nExample: Paste your draft blog post, email, or any text content and I\'ll improve clarity, fix grammar, and enhance engagement while maintaining your voice.',
  },
}

export default function ToolPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const tool = toolConfig[params.type]

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
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setLoading(true)
    setError('')
    setOutput('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: params.type, prompt }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Generation failed')
      }

      setOutput(data.output)

      // Refresh user to update usage count
      fetchUser()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tool not found</h1>
          <Link href="/dashboard" className="text-primary-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const isSubscribed = user?.subscriptionStatus === 'active'
  const remainingGenerations = isSubscribed ? '∞' : Math.max(0, 5 - (user?.monthlyUsage || 0))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-4xl mr-4">{tool.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{tool.name}</h1>
                <p className="text-gray-600">{tool.description}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Remaining generations</p>
              <p className="text-2xl font-bold text-primary-600">{remainingGenerations}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Input</h2>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={tool.placeholder}
              className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || (!isSubscribed && remainingGenerations === 0)}
              className="mt-4 w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Content'
              )}
            </button>

            {!isSubscribed && remainingGenerations === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium">You've used all free generations</p>
                <Link href="/pricing" className="text-primary-600 hover:underline text-sm">
                  Upgrade to Pro for unlimited access →
                </Link>
              </div>
            )}
          </div>

          {/* Output */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Generated Content</h2>
              {output && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-pulse-slow mb-2">
                      <span className="text-4xl">{tool.icon}</span>
                    </div>
                    <p className="text-gray-500">Generating your content...</p>
                  </div>
                </div>
              ) : output ? (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {output}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Your generated content will appear here
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-2">Tips for better results</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Be specific about your topic and target audience</li>
            <li>• Include key points you want covered</li>
            <li>• Specify the tone (professional, casual, persuasive, etc.)</li>
            <li>• Mention any specific requirements or constraints</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
