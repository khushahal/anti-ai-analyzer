import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Tools Comparison & Performance Analysis - Anti-AI Analyzer',
  description: 'Compare AI tools like GPT-4, Claude-3, Gemini Pro, Llama-2, and PaLM-2. Analyze accuracy, response time, cost, reliability, and performance metrics.',
  keywords: 'AI comparison, GPT-4, Claude-3, Gemini Pro, AI performance, accuracy comparison, AI tools analysis',
  openGraph: {
    title: 'AI Tools Comparison & Performance Analysis - Anti-AI Analyzer',
    description: 'Compare AI tools and analyze their performance metrics.',
    type: 'website',
    url: 'https://anti-ai-analyzer.com/comparison',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools Comparison & Performance Analysis',
    description: 'Compare AI tools and analyze their performance metrics.',
  },
}

export default function ComparisonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 