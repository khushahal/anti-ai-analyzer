import apiClient from './api'

export interface User {
  _id: string
  name: string
  email: string
  role: string
  isVerified: boolean
  avatar: string
  preferences: {
    theme: string
    notifications: {
      email: boolean
      push: boolean
    }
    preferredAI: string
  }
  stats: {
    totalQueries: number
    reportsSubmitted: number
    reportsVerified: number
    totalVotes: number
  }
  lastLogin: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: User
  message?: string
  errors?: any[]
}

class AuthService {
  private tokenKey = 'antiAI_token'
  private userKey = 'antiAI_user'
  private refreshTimeout: NodeJS.Timeout | null = null

  // Get stored token
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey)
    }
    return null
  }

  // Get stored user
  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(this.userKey)
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }

  // Set authentication data
  setAuth(token: string, user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token)
      localStorage.setItem(this.userKey, JSON.stringify(user))
      
      // Set up automatic token refresh (7 days = 604800000 ms)
      // Refresh 1 hour before expiry
      const refreshTime = 604800000 - (60 * 60 * 1000) // 7 days - 1 hour
      this.scheduleTokenRefresh(refreshTime)
    }
  }

  // Clear authentication data
  clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey)
      localStorage.removeItem(this.userKey)
      
      // Clear refresh timeout
      if (this.refreshTimeout) {
        clearTimeout(this.refreshTimeout)
        this.refreshTimeout = null
      }
    }
  }

  // Schedule automatic token refresh
  private scheduleTokenRefresh(delay: number): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout)
    }
    
    this.refreshTimeout = setTimeout(async () => {
      try {
        console.log('🔄 Attempting automatic token refresh...')
        const refreshed = await this.refreshToken()
        if (refreshed) {
          console.log('✅ Token refreshed successfully')
        } else {
          console.log('❌ Token refresh failed, logging out user')
          this.clearAuth()
          // You could emit an event here to notify the app
          window.dispatchEvent(new CustomEvent('auth:tokenExpired'))
        }
      } catch (error) {
        console.error('Token refresh error:', error)
        this.clearAuth()
        window.dispatchEvent(new CustomEvent('auth:tokenExpired'))
      }
    }, delay)
  }

  // Attempt to refresh the token
  private async refreshToken(): Promise<boolean> {
    try {
      // For now, we'll use a simple approach - try to get profile
      // In a real implementation, you'd have a refresh endpoint
      const response = await apiClient.getProfile()
      if (response.success && response.data) {
        // If we can get profile, token is still valid
        return true
      }
      return false
    } catch (error) {
      console.error('Refresh token error:', error)
      return false
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  // Check if token is about to expire (within 1 hour)
  isTokenExpiringSoon(): boolean {
    try {
      const token = this.getToken()
      if (!token) return false
      
      // Decode JWT payload (without verification for expiry check)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiryTime = payload.exp * 1000 // Convert to milliseconds
      const currentTime = Date.now()
      const oneHour = 60 * 60 * 1000
      
      return (expiryTime - currentTime) < oneHour
    } catch (error) {
      console.error('Token expiry check error:', error)
      return true // Assume expired if we can't check
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.login(credentials)
      
      if (response.success && response.token && response.user) {
        this.setAuth(response.token, response.user)
        return {
          success: true,
          token: response.token,
          user: response.user
        }
      } else {
        return {
          success: false,
          message: response.message || 'Login failed'
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      }
    }
  }

  // Register user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.register(data)
      
      if (response.success && response.token && response.user) {
        this.setAuth(response.token, response.user)
        return {
          success: true,
          token: response.token,
          user: response.user
        }
      } else {
        return {
          success: false,
          message: response.message || 'Registration failed'
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      }
    }
  }

  // Logout user
  logout(): void {
    this.clearAuth()
  }

  // Get current user profile
  async getProfile(): Promise<User | null> {
    try {
      const token = this.getToken()
      if (!token) return null

      const response = await apiClient.getProfile()
      if (response.success && response.data) {
        // Update stored user data
        localStorage.setItem(this.userKey, JSON.stringify(response.data))
        return response.data
      }
      return null
    } catch (error: any) {
      console.error('Get profile error:', error)
      // If token is invalid, clear auth
      if (error.response?.status === 401) {
        this.clearAuth()
      }
      return null
    }
  }

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<AuthResponse> {
    try {
      const response = await apiClient.updateProfile(data)
      
      if (response.success && response.data) {
        // Update stored user data
        localStorage.setItem(this.userKey, JSON.stringify(response.data))
        return {
          success: true,
          user: response.data
        }
      } else {
        return {
          success: false,
          message: response.message || 'Profile update failed'
        }
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed. Please try again.'
      }
    }
  }
}

export const authService = new AuthService()
export default authService
