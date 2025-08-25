export interface AITool {
  _id: string;
  name: string;
  slug: string;
  description: string;
  version: string;
  provider: string;
  category: string;
  capabilities: string[];
  pricing: {
    input: number;
    output: number;
    currency: string;
    unit: string;
  };
  performance: {
    current: {
      accuracy: number;
      responseTime: number;
      reliability: number;
      userSatisfaction: number;
    };
    historical: Array<{
      date: string;
      accuracy: number;
      responseTime: number;
      cost: number;
      reliability: number;
      userSatisfaction: number;
      totalQueries: number;
      successfulQueries: number;
      failedQueries: number;
    }>;
    lastUpdated: string;
  };
  stats: {
    totalQueries: number;
    totalMistakes: number;
    mistakeRate: number;
    averageResponseTime: number;
    totalCost: number;
    activeUsers: number;
  };
  status: string;
  isPublic: boolean;
  features: Array<{
    name: string;
    description: string;
    isAvailable: boolean;
  }>;
  limitations: string[];
  documentation?: {
    url: string;
    lastUpdated: string;
  };
  logo: string;
  website: string;
  apiEndpoint: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  avatar: string;
  preferences: {
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
    preferredAI: string;
  };
  stats: {
    totalQueries: number;
    reportsSubmitted: number;
    reportsVerified: number;
    totalVotes: number;
  };
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthApiResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
