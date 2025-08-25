const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: any[]
}

// Auth-specific response interfaces
export interface AuthApiResponse {
  success: boolean
  token?: string
  user?: any
  message?: string
  errors?: any[]
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('antiAI_token')
    }
    return null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    // Get auth token if available
    const token = this.getAuthToken()
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          // Clear invalid token
          if (typeof window !== 'undefined') {
            localStorage.removeItem('antiAI_token')
            localStorage.removeItem('antiAI_user')
          }
        }
        
        throw new Error(data.message || `API request failed: ${response.status}`)
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

  // Auth endpoints - return AuthApiResponse directly
  async register(userData: { name: string; email: string; password: string }): Promise<AuthApiResponse> {
    const url = `${this.baseUrl}/api/auth/register`
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || `Registration failed: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      }
    }
  }

  async login(credentials: { email: string; password: string }): Promise<AuthApiResponse> {
    const url = `${this.baseUrl}/api/auth/login`
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || `Login failed: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      }
    }
  }

  async getProfile() {
    return this.request('/api/auth/me')
  }

  async updateProfile(profileData: { name?: string; email?: string; preferredAI?: string }) {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }) {
    return this.request('/api/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
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