import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: 'Anti-AI Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
} 