const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: any[]
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed')
      }
      
      return data
    } catch (error) {
      console.error('API request error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  // Auth endpoints
  async register(userData: { name: string; email: string; password: string }) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  // Analytics endpoints
  async getDashboardAnalytics(period: string = '30d') {
    return this.request(`/api/analytics/dashboard?period=${period}`)
  }

  // Mistake reports endpoints
  async getMistakes(params: {
    page?: number
    limit?: number
    aiTool?: string
    category?: string
    severity?: string
    status?: string
    sort?: string
  } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })
    
    return this.request(`/api/mistakes?${searchParams.toString()}`)
  }

  async submitMistakeReport(reportData: {
    aiTool: string
    category: string
    severity: string
    userQuery: string
    aiResponse: string
    correctedAnswer: string
    description: string
    impact?: string
    isAnonymous?: boolean
  }) {
    return this.request('/api/mistakes', {
      method: 'POST',
      body: JSON.stringify(reportData),
    })
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health')
  }
}

export const apiClient = new ApiClient(API_BASE)
export default apiClient 