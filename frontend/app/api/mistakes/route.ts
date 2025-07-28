import { NextRequest, NextResponse } from 'next/server'

// Mock database for demo - in production, use a real database
let mistakeReports: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const aiTool = searchParams.get('aiTool')
    const category = searchParams.get('category')
    const severity = searchParams.get('severity')
    const status = searchParams.get('status') || 'verified'
    const sort = searchParams.get('sort') || 'newest'

    // Build filter
    let filteredReports = mistakeReports.filter(report => {
      if (aiTool && report.aiTool !== aiTool) return false
      if (category && report.category !== category) return false
      if (severity && report.severity !== severity) return false
      if (status && report.status !== status) return false
      return true
    })

    // Sort
    switch (sort) {
      case 'newest':
        filteredReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filteredReports.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'most-voted':
        filteredReports.sort((a, b) => (b.voteScore || 0) - (a.voteScore || 0))
        break
      case 'least-voted':
        filteredReports.sort((a, b) => (a.voteScore || 0) - (b.voteScore || 0))
        break
    }

    // Pagination
    const skip = (page - 1) * limit
    const paginatedReports = filteredReports.slice(skip, skip + limit)

    return NextResponse.json({
      success: true,
      data: paginatedReports,
      pagination: {
        page,
        limit,
        total: filteredReports.length,
        pages: Math.ceil(filteredReports.length / limit)
      }
    })

  } catch (error) {
    console.error('Get mistakes error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      aiTool,
      category,
      severity,
      userQuery,
      aiResponse,
      correctedAnswer,
      description,
      impact,
      isAnonymous = false
    } = body

    // Validation
    if (!aiTool || !category || !severity || !userQuery || !aiResponse || !correctedAnswer || !description) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Create report
    const report = {
      id: Date.now().toString(),
      aiTool,
      category,
      severity,
      userQuery,
      aiResponse,
      correctedAnswer,
      description,
      impact,
      isAnonymous,
      status: 'pending',
      upvotes: 0,
      downvotes: 0,
      voteScore: 0,
      totalVotes: 0,
      views: 0,
      createdAt: new Date(),
      reporter: isAnonymous ? null : 'demo-user'
    }

    mistakeReports.unshift(report)

    return NextResponse.json({
      success: true,
      message: 'Mistake report submitted successfully',
      report
    }, { status: 201 })

  } catch (error) {
    console.error('Submit mistake error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 