import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Mistake Analysis & Detection - Anti-AI Analyzer',
  description: 'Comprehensive analysis of AI tool mistakes, error patterns, and detection systems. Find factual errors, logical fallacies, bias issues, and context errors in AI responses.',
  keywords: 'AI mistakes, error detection, factual errors, AI bias, logical fallacies, AI analysis, mistake patterns',
  openGraph: {
    title: 'AI Mistake Analysis & Detection - Anti-AI Analyzer',
    description: 'Comprehensive analysis of AI tool mistakes, error patterns, and detection systems.',
    type: 'website',
    url: 'https://anti-ai-analyzer.com/mistakes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Mistake Analysis & Detection',
    description: 'Comprehensive analysis of AI tool mistakes and error patterns.',
  },
}

export default function MistakesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 