/**
 * Task status enum
 */
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

/**
 * Task priority enum
 */
export type TaskPriority = 'high' | 'medium' | 'low'

/**
 * User interface
 */
export interface User {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  createdAt: string
}

/**
 * Task interface
 */
export interface Task {
  id: string
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  tags: string[]
  estimateMinutes?: number
  actualMinutes?: number
  dueDate?: string
  completedAt?: string
  postponeCount: number
  createdAt: string
  updatedAt: string
}

/**
 * Task session for timer
 */
export interface TaskSession {
  id: string
  taskId: string
  startTs: string
  endTs?: string
  durationMinutes?: number
  pauseCount: number
}

/**
 * Create task input
 */
export interface CreateTaskInput {
  title: string
  description?: string
  priority: TaskPriority
  estimateMinutes?: number
  dueDate?: string
  tags?: string[]
}

/**
 * Update task input (all fields optional)
 */
export interface UpdateTaskInput {
  title?: string
  description?: string
  priority?: TaskPriority
  status?: TaskStatus
  estimateMinutes?: number
  dueDate?: string
  tags?: string[]
}

/**
 * Auth tokens
 */
export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/**
 * Login input
 */
export interface LoginInput {
  email: string
  password: string
}

/**
 * Register input
 */
export interface RegisterInput {
  email: string
  password: string
  displayName: string
}

/**
 * Login response
 */
export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

/**
 * Register response
 */
export interface RegisterResponse {
  user: User
  tokens: AuthTokens
}

/**
 * Task list response
 */
export interface TaskListResponse {
  tasks: Task[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

/**
 * Alternative task for recommendation
 */
export interface AlternativeTask {
  taskId: string
  title: string
  reason: string
}

/**
 * Agent recommendation
 */
export interface Recommendation {
  id: string
  recommendedTask: Task
  rationale: string
  suggestedDuration: number
  alternatives: AlternativeTask[]
  timestamp: string
}

/**
 * Intervention subtask
 */
export interface SubTask {
  id: string
  title: string
  estimatedMinutes: number
}

/**
 * Intervention
 */
export interface Intervention {
  id: string
  taskId: string
  message: string
  subTasks: SubTask[]
  triggeredAt: string
}

/**
 * Intervention response
 */
export interface InterventionResponse {
  action: 'start_now' | 'delay' | 'ignore_today'
  taskId: string
  delayMinutes?: number
}

/**
 * Daily review question
 */
export interface ReviewQuestion {
  id: string
  question: string
  answer?: string
}

/**
 * Daily review stats
 */
export interface ReviewStats {
  completedTasksCount: number
  focusMinutes: number
  procrastinationCount: number
  tasksCreatedCount: number
}

/**
 * Agent suggestions
 */
export interface AgentSuggestions {
  suggestions: string[]
  improvements: string[]
}

/**
 * Daily review
 */
export interface DailyReview {
  id: string
  date: string
  questions: ReviewQuestion[]
  stats: ReviewStats
  suggestions: AgentSuggestions
  createdAt: string
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data: T
  success: boolean
  message?: string
}

/**
 * API error
 */
export interface ApiError {
  message: string
  code?: string
  details?: Record<string, unknown>
}
