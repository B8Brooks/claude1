import Link from 'next/link'
import Navbar from '@/components/Navbar'

const features = [
  {
    icon: '📝',
    title: 'Blog Post Generator',
    description: 'Create engaging, SEO-optimized blog posts in seconds. Perfect for content marketers and bloggers.',
  },
  {
    icon: '📧',
    title: 'Email Writer',
    description: 'Craft compelling emails that get opened and drive action. From cold outreach to newsletters.',
  },
  {
    icon: '📱',
    title: 'Social Media Content',
    description: 'Generate scroll-stopping posts for Twitter, LinkedIn, Instagram, and more.',
  },
  {
    icon: '🛍️',
    title: 'Product Descriptions',
    description: 'Write product copy that converts browsers into buyers. Perfect for e-commerce.',
  },
  {
    icon: '📰',
    title: 'Headline Generator',
    description: 'Create click-worthy headlines that grab attention and drive engagement.',
  },
  {
    icon: '✨',
    title: 'Content Rewriter',
    description: 'Transform and improve existing content while maintaining your voice.',
  },
]

const testimonials = [
  {
    quote: "WriteFlow AI has cut my content creation time in half. The blog posts it generates are incredibly well-structured.",
    author: "Sarah M.",
    role: "Content Marketing Manager"
  },
  {
    quote: "I use it every day for email campaigns. The open rates have improved significantly since I started using it.",
    author: "Mike R.",
    role: "Growth Marketer"
  },
  {
    quote: "The social media tool is amazing. It understands each platform's unique style and creates perfect posts.",
    author: "Emily L.",
    role: "Social Media Manager"
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Write Better Content <span className="gradient-text">10x Faster</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AI-powered writing tools for blog posts, emails, social media, and product descriptions.
              Start free with 5 generations per month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Start Free - No Credit Card
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold border border-gray-200 hover:border-gray-300 transition-all"
              >
                View Pricing
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Join 10,000+ writers, marketers, and entrepreneurs
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All the Writing Tools You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powered by advanced AI to help you create professional content in seconds
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm card-hover"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Create professional content in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose a Tool</h3>
              <p className="text-gray-600">
                Select from blog posts, emails, social media, or product descriptions
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Describe Your Content</h3>
              <p className="text-gray-600">
                Tell us what you want to write about, your audience, and key points
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Your Content</h3>
              <p className="text-gray-600">
                Receive professionally written content ready to use or customize
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Content Creators
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-xl"
              >
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Writing?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Start with 5 free generations. No credit card required.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span className="text-xl font-bold text-white">WriteFlow AI</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/login" className="hover:text-white transition-colors">Login</Link>
              <Link href="/register" className="hover:text-white transition-colors">Sign Up</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} WriteFlow AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
