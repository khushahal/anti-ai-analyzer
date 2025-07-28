import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Anti-AI Analyzer - AI Tool Analysis & Mistake Detection',
  description: 'Comprehensive platform to analyze AI tools, detect mistakes, and compare performance in real-time. Track AI accuracy, report mistakes, and get personalized insights.',
  keywords: 'AI analysis, mistake detection, AI comparison, performance metrics, GPT-4, Claude-3, Gemini Pro, AI tools, error detection',
  authors: [{ name: 'Anti-AI Team' }],
  creator: 'Anti-AI Analyzer',
  publisher: 'Anti-AI Analyzer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://anti-ai-analyzer.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Anti-AI Analyzer - AI Tool Analysis & Mistake Detection',
    description: 'Comprehensive platform to analyze AI tools, detect mistakes, and compare performance in real-time.',
    url: 'https://anti-ai-analyzer.com',
    siteName: 'Anti-AI Analyzer',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Anti-AI Analyzer Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anti-AI Analyzer - AI Tool Analysis & Mistake Detection',
    description: 'Comprehensive platform to analyze AI tools, detect mistakes, and compare performance in real-time.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
} 