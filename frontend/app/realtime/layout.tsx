import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Real-time AI Performance Monitoring - Anti-AI Analyzer',
  description: 'Live monitoring of AI tool performance, real-time mistake detection, and instant analytics. Track AI accuracy, response times, and error patterns as they happen.',
  keywords: 'real-time AI monitoring, live AI performance, AI mistake detection, live analytics, AI tracking',
  openGraph: {
    title: 'Real-time AI Performance Monitoring - Anti-AI Analyzer',
    description: 'Live monitoring of AI tool performance and real-time mistake detection.',
    type: 'website',
    url: 'https://anti-ai-analyzer.com/realtime',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real-time AI Performance Monitoring',
    description: 'Live monitoring of AI tool performance and real-time mistake detection.',
  },
}

export default function RealtimeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 