/**
 * API Client
 * Provides a unified interface for API calls, switching between mock and real API based on environment
 */

import { mockApi } from './mock'
import type {
  LoginInput,
  RegisterInput,
  CreateTaskInput,
  UpdateTaskInput,
  LoginResponse,
  RegisterResponse,
  TaskListResponse,
  Task,
  TaskSession,
  Recommendation,
  Intervention,
  InterventionResponse,
  DailyReview,
  ReviewStats,
  ApiResponse,
} from './types'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

// Local storage keys
const ACCESS_TOKEN_KEY = 'fp_access_token'
const REFRESH_TOKEN_KEY = 'fp_refresh_token'

/**
 * Get stored access token
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

/**
 * Set access token
 */
export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

/**
 * Clear auth tokens
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/**
 * Build fetch options with auth header
 */
function buildAuthHeaders(): HeadersInit {
  const token = getAccessToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

/**
 * Generic fetch wrapper
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  if (USE_MOCK) {
    throw new Error('Mock mode: use mockApi functions directly')
  }

  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: { ...buildAuthHeaders(), ...options.headers },
  })

  // Handle 401 Unauthorized - try to refresh token
  if (response.status === 401) {
    try {
      await apiClient.refreshToken()
      // Retry the original request
      const retryResponse = await fetch(url, {
        ...options,
        headers: { ...buildAuthHeaders(), ...options.headers },
      })
      return await handleResponse<T>(retryResponse)
    } catch {
      clearTokens()
      window.location.href = '/login'
      throw new Error('Session expired')
    }
  }

  return await handleResponse<T>(response)
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')

  if (!response.ok) {
    let errorMessage = response.statusText

    if (isJson) {
      const errorData = await response.json()
      errorMessage = errorData.message || errorData.error || errorMessage
    }

    throw new Error(errorMessage)
  }

  if (!isJson || response.status === 204) {
    return { success: true, data: undefined as T }
  }

  const data = await response.json()
  return { success: true, data }
}

// ===== Real API Endpoints =====

const realApi = {
  // Auth
  async login(input: LoginInput): Promise<ApiResponse<LoginResponse>> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const result = await handleResponse<LoginResponse>(response)

    if (result.success && result.data) {
      setAccessToken(result.data.tokens.accessToken)
      if (typeof window !== 'undefined') {
        localStorage.setItem(REFRESH_TOKEN_KEY, result.data.tokens.refreshToken)
      }
    }

    return result
  },

  async register(input: RegisterInput): Promise<ApiResponse<RegisterResponse>> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const result = await handleResponse<RegisterResponse>(response)

    if (result.success && result.data) {
      setAccessToken(result.data.tokens.accessToken)
      if (typeof window !== 'undefined') {
        localStorage.setItem(REFRESH_TOKEN_KEY, result.data.tokens.refreshToken)
      }
    }

    return result
  },

  async logout(): Promise<ApiResponse<void>> {
    clearTokens()
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: buildAuthHeaders(),
      })
    } catch {
      // Ignore errors during logout
    }
    return { success: true, data: undefined }
  },

  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    const refreshToken = typeof window !== 'undefined'
      ? localStorage.getItem(REFRESH_TOKEN_KEY)
      : null

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    const result = await handleResponse<{ accessToken: string }>(response)

    if (result.success && result.data) {
      setAccessToken(result.data.accessToken)
    }

    return result
  },

  async getCurrentUser(): Promise<ApiResponse> {
    return fetchApi('/auth/me')
  },

  // Tasks
  async getTasks(): Promise<ApiResponse<TaskListResponse>> {
    return fetchApi('/tasks')
  },

  async getTask(id: string): Promise<ApiResponse<Task>> {
    return fetchApi(`/tasks/${id}`)
  },

  async createTask(input: CreateTaskInput): Promise<ApiResponse<Task>> {
    return fetchApi('/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  async updateTask(id: string, input: UpdateTaskInput): Promise<ApiResponse<Task>> {
    return fetchApi(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    })
  },

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return fetchApi(`/tasks/${id}`, {
      method: 'DELETE',
    })
  },

  async startTask(id: string): Promise<ApiResponse<TaskSession>> {
    return fetchApi(`/tasks/${id}/start`, {
      method: 'POST',
    })
  },

  async pauseTask(): Promise<ApiResponse<TaskSession>> {
    return fetchApi(`/tasks/pause`, {
      method: 'POST',
    })
  },

  async completeTask(id: string): Promise<ApiResponse<Task>> {
    return fetchApi(`/tasks/${id}/complete`, {
      method: 'POST',
    })
  },

  // Agent
  async getRecommendation(availableMinutes?: number, context?: string): Promise<ApiResponse<Recommendation>> {
    return fetchApi('/agent/recommend', {
      method: 'POST',
      body: JSON.stringify({ availableMinutes, context }),
    })
  },

  async provideFeedback(decisionId: string, adopted: boolean): Promise<ApiResponse<void>> {
    return fetchApi('/agent/feedback', {
      method: 'POST',
      body: JSON.stringify({ decisionId, adopted }),
    })
  },

  async getRecommendationHistory(): Promise<ApiResponse<Recommendation[]>> {
    return fetchApi('/agent/recommendations')
  },

  // Intervention
  async triggerIntervention(taskId: string): Promise<ApiResponse<Intervention>> {
    return fetchApi('/intervention/trigger', {
      method: 'POST',
      body: JSON.stringify({ taskId }),
    })
  },

  async respondToIntervention(interventionId: string, response: InterventionResponse): Promise<ApiResponse<void>> {
    return fetchApi('/intervention/respond', {
      method: 'POST',
      body: JSON.stringify({ interventionId, response }),
    })
  },

  async getInterventionHistory(): Promise<ApiResponse<Intervention[]>> {
    return fetchApi('/interventions')
  },

  // Heartbeat
  async heartbeat(): Promise<ApiResponse<{ userId: string; timestamp: string }>> {
    return fetchApi('/heartbeat', {
      method: 'POST',
    })
  },

  // Daily Review
  async submitDailyReview(answers: string[]): Promise<ApiResponse<DailyReview>> {
    return fetchApi('/review', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    })
  },

  async getDailyReview(date: string): Promise<ApiResponse<DailyReview>> {
    return fetchApi(`/review/${date}`)
  },

  async getReviewHistory(): Promise<ApiResponse<DailyReview[]>> {
    return fetchApi('/reviews')
  },

  async getTodayStats(): Promise<ApiResponse<ReviewStats>> {
    return fetchApi('/stats/today')
  },
}

// ===== Unified API Client =====

/**
 * Unified API client that automatically switches between mock and real API
 * based on the VITE_USE_MOCK_API environment variable
 */
export const apiClient = {
  /**
   * Check if using mock mode
   */
  isMock: USE_MOCK,

  /**
   * Get API base URL
   */
  baseUrl: API_BASE_URL,

  // ===== Auth =====
  login: (input: LoginInput) =>
    USE_MOCK ? mockApi.login(input) : realApi.login(input),
  register: (input: RegisterInput) =>
    USE_MOCK ? mockApi.register(input) : realApi.register(input),
  logout: () =>
    USE_MOCK ? mockApi.logout() : realApi.logout(),
  refreshToken: () =>
    USE_MOCK ? mockApi.refreshToken() : realApi.refreshToken(),
  getCurrentUser: () =>
    USE_MOCK ? mockApi.getCurrentUser() : realApi.getCurrentUser(),

  // ===== Tasks =====
  getTasks: () =>
    USE_MOCK ? mockApi.getTasks() : realApi.getTasks(),
  getTask: (id: string) =>
    USE_MOCK ? mockApi.getTask(id) : realApi.getTask(id),
  createTask: (input: CreateTaskInput) =>
    USE_MOCK ? mockApi.createTask(input) : realApi.createTask(input),
  updateTask: (id: string, input: UpdateTaskInput) =>
    USE_MOCK ? mockApi.updateTask(id, input) : realApi.updateTask(id, input),
  deleteTask: (id: string) =>
    USE_MOCK ? mockApi.deleteTask(id) : realApi.deleteTask(id),
  startTask: (id: string) =>
    USE_MOCK ? mockApi.startTask(id) : realApi.startTask(id),
  pauseTask: () =>
    USE_MOCK ? mockApi.pauseTask() : realApi.pauseTask(),
  completeTask: (id: string) =>
    USE_MOCK ? mockApi.completeTask(id) : realApi.completeTask(id),

  // ===== Agent =====
  getRecommendation: (availableMinutes?: number, context?: string) =>
    USE_MOCK ? mockApi.getRecommendation(availableMinutes, context) : realApi.getRecommendation(availableMinutes, context),
  provideFeedback: (decisionId: string, adopted: boolean) =>
    USE_MOCK ? mockApi.provideFeedback(decisionId, adopted) : realApi.provideFeedback(decisionId, adopted),
  getRecommendationHistory: () =>
    USE_MOCK ? mockApi.getRecommendationHistory() : realApi.getRecommendationHistory(),

  // ===== Intervention =====
  triggerIntervention: (taskId: string) =>
    USE_MOCK ? mockApi.triggerIntervention(taskId) : realApi.triggerIntervention(taskId),
  respondToIntervention: (interventionId: string, response: InterventionResponse) =>
    USE_MOCK ? mockApi.respondToIntervention(interventionId, response) : realApi.respondToIntervention(interventionId, response),
  getInterventionHistory: () =>
    USE_MOCK ? mockApi.getInterventionHistory() : realApi.getInterventionHistory(),

  // ===== Heartbeat =====
  heartbeat: () =>
    USE_MOCK ? mockApi.heartbeat() : realApi.heartbeat(),

  // ===== Daily Review =====
  submitDailyReview: (answers: string[]) =>
    USE_MOCK ? mockApi.submitDailyReview(answers) : realApi.submitDailyReview(answers),
  getDailyReview: (date: string) =>
    USE_MOCK ? mockApi.getDailyReview(date) : realApi.getDailyReview(date),
  getReviewHistory: () =>
    USE_MOCK ? mockApi.getReviewHistory() : realApi.getReviewHistory(),
  getTodayStats: () =>
    USE_MOCK ? mockApi.getTodayStats() : realApi.getTodayStats(),
}
