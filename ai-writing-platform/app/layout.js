import './globals.css'

export const metadata = {
  title: 'WriteFlow AI - AI-Powered Writing Tools',
  description: 'Generate high-quality blog posts, emails, social media content, and product descriptions with AI. Start free, upgrade for unlimited access.',
  keywords: 'AI writing, content generator, blog writer, email writer, social media content, copywriting',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
