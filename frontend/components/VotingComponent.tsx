'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown, TrendingUp } from 'lucide-react'

interface VotingComponentProps {
  id: string
  initialUpvotes: number
  initialDownvotes: number
  onVote: (id: string, type: 'upvote' | 'downvote') => void
  userVote?: 'upvote' | 'downvote' | null
}

export default function VotingComponent({ 
  id, 
  initialUpvotes, 
  initialDownvotes, 
  onVote, 
  userVote = null 
}: VotingComponentProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [currentVote, setCurrentVote] = useState(userVote)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (isVoting) return

    setIsVoting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    if (currentVote === voteType) {
      // Remove vote
      if (voteType === 'upvote') {
        setUpvotes(prev => prev - 1)
      } else {
        setDownvotes(prev => prev - 1)
      }
      setCurrentVote(null)
    } else {
      // Add or change vote
      if (voteType === 'upvote') {
        setUpvotes(prev => prev + 1)
        if (currentVote === 'downvote') {
          setDownvotes(prev => prev - 1)
        }
      } else {
        setDownvotes(prev => prev + 1)
        if (currentVote === 'upvote') {
          setUpvotes(prev => prev - 1)
        }
      }
      setCurrentVote(voteType)
    }

    onVote(id, voteType)
    setIsVoting(false)
  }

  const totalVotes = upvotes - downvotes
  const isPositive = totalVotes > 0
  const isNegative = totalVotes < 0

  return (
    <div className="flex items-center space-x-4">
      {/* Upvote Button */}
      <button
        onClick={() => handleVote('upvote')}
        disabled={isVoting}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
          currentVote === 'upvote'
            ? 'bg-success-100 text-success-700 border border-success-200'
            : 'text-gray-600 hover:text-success-600 hover:bg-success-50'
        } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ThumbsUp className={`h-4 w-4 ${currentVote === 'upvote' ? 'fill-current' : ''}`} />
        <span className="font-medium">{upvotes}</span>
      </button>

      {/* Vote Score */}
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
        isPositive 
          ? 'bg-success-100 text-success-700' 
          : isNegative 
            ? 'bg-error-100 text-error-700' 
            : 'bg-gray-100 text-gray-700'
      }`}>
        <TrendingUp className={`h-3 w-3 ${
          isPositive ? 'text-success-600' : isNegative ? 'text-error-600 rotate-180' : 'text-gray-500'
        }`} />
        <span className="text-sm font-medium">
          {totalVotes > 0 ? '+' : ''}{totalVotes}
        </span>
      </div>

      {/* Downvote Button */}
      <button
        onClick={() => handleVote('downvote')}
        disabled={isVoting}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
          currentVote === 'downvote'
            ? 'bg-error-100 text-error-700 border border-error-200'
            : 'text-gray-600 hover:text-error-600 hover:bg-error-50'
        } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ThumbsDown className={`h-4 w-4 ${currentVote === 'downvote' ? 'fill-current' : ''}`} />
        <span className="font-medium">{downvotes}</span>
      </button>
    </div>
  )
} 