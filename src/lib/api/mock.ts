/**
 * Mock API Implementation
 * Simulates backend API responses with delays and realistic data
 */

import type {
  User,
  Task,
  TaskSession,
  LoginInput,
  RegisterInput,
  CreateTaskInput,
  UpdateTaskInput,
  LoginResponse,
  RegisterResponse,
  TaskListResponse,
  Recommendation,
  Intervention,
  InterventionResponse,
  DailyReview,
  ReviewStats,
  AgentSuggestions,
  ApiResponse,
} from './types'

// Delay helper to simulate network latency
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// ===== Mock Data Stores =====

let mockUser: User | null = null
let mockAccessToken: string | null = null

const mockTasks: Task[] = [
  {
    id: '1',
    title: '完成项目文档',
    description: '编写 FlowPilot 项目的技术文档和用户手册',
    priority: 'high',
    status: 'pending',
    tags: ['work', 'documentation'],
    estimateMinutes: 120,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    postponeCount: 0,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: '代码评审',
    description: '审查团队提交的 PR 并提供反馈',
    priority: 'medium',
    status: 'in_progress',
    tags: ['work', 'code-review'],
    estimateMinutes: 45,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    postponeCount: 1,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: '学习 Svelte 5 Runes',
    description: '深入研究 Svelte 5 的响应式系统',
    priority: 'low',
    status: 'completed',
    tags: ['learning', 'svelte'],
    estimateMinutes: 60,
    actualMinutes: 75,
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    postponeCount: 0,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: '回复邮件',
    description: '处理收件箱中的待处理邮件',
    priority: 'medium',
    status: 'pending',
    tags: ['work', 'communication'],
    estimateMinutes: 30,
    dueDate: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    postponeCount: 2,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
]

let mockSessions: TaskSession[] = [
  {
    id: 'session-1',
    taskId: '3',
    startTs: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    endTs: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 60,
    pauseCount: 1,
  },
]

let mockRecommendations: Recommendation[] = []
let mockInterventions: Intervention[] = []
let mockReviews: DailyReview[] = []

// ===== Mock API Functions =====

export const mockApi = {
  // ===== Auth =====

  /**
   * Mock login - accepts test@example.com / password123
   */
  async login(input: LoginInput): Promise<ApiResponse<LoginResponse>> {
    await delay(500)

    // Simulate successful login with test credentials
    if (input.email === 'test@example.com' && input.password === 'password123') {
      mockUser = {
        id: 'user-1',
        email: input.email,
        displayName: '测试用户',
        avatarUrl: undefined,
        createdAt: new Date().toISOString(),
      }
      mockAccessToken = 'mock-access-token-' + generateId()

      return {
        success: true,
        data: {
          user: mockUser,
          tokens: {
            accessToken: mockAccessToken,
            refreshToken: 'mock-refresh-token-' + generateId(),
          },
        },
      }
    }

    // Simulate failure
    throw new Error('邮箱或密码错误')
  },

  /**
   * Mock register
   */
  async register(input: RegisterInput): Promise<ApiResponse<RegisterResponse>> {
    await delay(600)

    // Check if email already exists (mock)
    if (input.email === 'exists@example.com') {
      throw new Error('该邮箱已被注册')
    }

    mockUser = {
      id: generateId(),
      email: input.email,
      displayName: input.displayName,
      avatarUrl: undefined,
      createdAt: new Date().toISOString(),
    }
    mockAccessToken = 'mock-access-token-' + generateId()

    return {
      success: true,
      data: {
        user: mockUser,
        tokens: {
          accessToken: mockAccessToken,
          refreshToken: 'mock-refresh-token-' + generateId(),
        },
      },
    }
  },

  /**
   * Mock logout
   */
  async logout(): Promise<ApiResponse<void>> {
    await delay(200)
    mockUser = null
    mockAccessToken = null
    return { success: true, data: undefined }
  },

  /**
   * Mock refresh token
   */
  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    await delay(200)
    mockAccessToken = 'mock-access-token-' + generateId()
    return {
      success: true,
      data: { accessToken: mockAccessToken! },
    }
  },

  /**
   * Mock get current user
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(300)
    if (!mockUser) {
      throw new Error('未登录')
    }
    return { success: true, data: mockUser }
  },

  // ===== Tasks =====

  /**
   * Mock get tasks list
   */
  async getTasks(): Promise<ApiResponse<TaskListResponse>> {
    await delay(300)
    return {
      success: true,
      data: {
        tasks: mockTasks,
        pagination: { page: 1, limit: 20, total: mockTasks.length },
      },
    }
  },

  /**
   * Mock get task by id
   */
  async getTask(id: string): Promise<ApiResponse<Task>> {
    await delay(200)
    const task = mockTasks.find((t) => t.id === id)
    if (!task) {
      throw new Error('任务不存在')
    }
    return { success: true, data: task }
  },

  /**
   * Mock create task
   */
  async createTask(input: CreateTaskInput): Promise<ApiResponse<Task>> {
    await delay(400)

    const newTask: Task = {
      id: generateId(),
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: 'pending',
      tags: input.tags || [],
      estimateMinutes: input.estimateMinutes,
      dueDate: input.dueDate,
      postponeCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockTasks.unshift(newTask)
    return { success: true, data: newTask }
  },

  /**
   * Mock update task
   */
  async updateTask(id: string, input: UpdateTaskInput): Promise<ApiResponse<Task>> {
    await delay(300)

    const taskIndex = mockTasks.findIndex((t) => t.id === id)
    if (taskIndex === -1) {
      throw new Error('任务不存在')
    }

    const task = mockTasks[taskIndex]
    const updatedTask: Task = {
      ...task,
      ...input,
      updatedAt: new Date().toISOString(),
    }

    mockTasks[taskIndex] = updatedTask
    return { success: true, data: updatedTask }
  },

  /**
   * Mock delete task
   */
  async deleteTask(id: string): Promise<ApiResponse<void>> {
    await delay(250)

    const taskIndex = mockTasks.findIndex((t) => t.id === id)
    if (taskIndex === -1) {
      throw new Error('任务不存在')
    }

    mockTasks.splice(taskIndex, 1)
    // Also delete associated sessions
    mockSessions = mockSessions.filter((s) => s.taskId !== id)
    return { success: true, data: undefined }
  },

  /**
   * Mock start task (create session)
   */
  async startTask(id: string): Promise<ApiResponse<TaskSession>> {
    await delay(300)

    const task = mockTasks.find((t) => t.id === id)
    if (!task) {
      throw new Error('任务不存在')
    }

    // Update task status
    task.status = 'in_progress'
    task.updatedAt = new Date().toISOString()

    const session: TaskSession = {
      id: 'session-' + generateId(),
      taskId: id,
      startTs: new Date().toISOString(),
      pauseCount: 0,
    }

    mockSessions.push(session)
    return { success: true, data: session }
  },

  /**
   * Mock pause task
   */
  async pauseTask(): Promise<ApiResponse<TaskSession>> {
    await delay(200)

    // Find active session
    const activeSession = mockSessions.find((s) => !s.endTs)
    if (!activeSession) {
      throw new Error('没有进行中的任务')
    }

    activeSession.endTs = new Date().toISOString()
    activeSession.durationMinutes = Math.floor(
      (new Date(activeSession.endTs).getTime() - new Date(activeSession.startTs).getTime()) /
        (1000 * 60)
    )

    return { success: true, data: activeSession }
  },

  /**
   * Mock complete task
   */
  async completeTask(id: string): Promise<ApiResponse<Task>> {
    await delay(300)

    const task = mockTasks.find((t) => t.id === id)
    if (!task) {
      throw new Error('任务不存在')
    }

    // Complete any active session
    const activeSession = mockSessions.find((s) => s.taskId === id && !s.endTs)
    if (activeSession) {
      activeSession.endTs = new Date().toISOString()
      activeSession.durationMinutes = Math.floor(
        (new Date(activeSession.endTs).getTime() - new Date(activeSession.startTs).getTime()) /
          (1000 * 60)
      )
    }

    // Update task
    task.status = 'completed'
    task.completedAt = new Date().toISOString()
    task.updatedAt = new Date().toISOString()

    // Calculate total actual minutes from sessions
    const taskSessions = mockSessions.filter((s) => s.taskId === id)
    const totalMinutes = taskSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0)
    task.actualMinutes = totalMinutes

    return { success: true, data: task }
  },

  // ===== Agent Recommendation =====

  /**
   * Mock get recommendation
   */
  async getRecommendation(
    availableMinutes?: number,
    context?: string
  ): Promise<ApiResponse<Recommendation>> {
    await delay(1000)

    const pendingTasks = mockTasks.filter((t) => t.status === 'pending')

    if (pendingTasks.length === 0) {
      throw new Error('没有待处理的任务')
    }

    // Select a task based on priority and available time
    let selectedTask = pendingTasks[0]
    for (const task of pendingTasks) {
      if (
        task.priority === 'high' &&
        (!availableMinutes || task.estimateMinutes === undefined || task.estimateMinutes <= availableMinutes)
      ) {
        selectedTask = task
        break
      }
    }

    const recommendation: Recommendation = {
      id: generateId(),
      recommendedTask: selectedTask,
      rationale: context
        ? `根据你的描述"${context}"，建议现在处理"${selectedTask.title}"。这是高优先级任务，有助于推进项目进度。`
        : `你现在有${availableMinutes || 60}分钟可用时间，建议先处理"${selectedTask.title}"。这是${selectedTask.priority === 'high' ? '高优先级' : '当前最重要的'}任务。`,
      suggestedDuration: selectedTask.estimateMinutes || 45,
      alternatives: pendingTasks
        .filter((t) => t.id !== selectedTask.id)
        .slice(0, 2)
        .map((t) => ({
          taskId: t.id,
          title: t.title,
          reason: t.priority === 'high' ? '同样是高优先级任务' : '可以稍后处理',
        })),
      timestamp: new Date().toISOString(),
    }

    mockRecommendations.push(recommendation)
    return { success: true, data: recommendation }
  },

  /**
   * Mock provide recommendation feedback
   */
  async provideFeedback(
    _decisionId: string,
    _adopted: boolean
  ): Promise<ApiResponse<void>> {
    await delay(200)
    // In a real app, this would store feedback for improving recommendations
    return { success: true, data: undefined }
  },

  /**
   * Mock get recommendation history
   */
  async getRecommendationHistory(): Promise<ApiResponse<Recommendation[]>> {
    await delay(300)
    return { success: true, data: mockRecommendations }
  },

  // ===== Intervention =====

  /**
   * Mock trigger intervention
   */
  async triggerIntervention(taskId: string): Promise<ApiResponse<Intervention>> {
    await delay(500)

    const task = mockTasks.find((t) => t.id === taskId)
    if (!task) {
      throw new Error('任务不存在')
    }

    // Generate sub-tasks
    const subTasks = [
      {
        id: generateId(),
        title: `第一步：${task.title} - 收集资料`,
        estimatedMinutes: Math.ceil((task.estimateMinutes || 60) / 3),
      },
      {
        id: generateId(),
        title: `第二步：${task.title} - 主要工作`,
        estimatedMinutes: Math.ceil((task.estimateMinutes || 60) / 2),
      },
      {
        id: generateId(),
        title: `第三步：${task.title} - 检查与整理`,
        estimatedMinutes: Math.ceil((task.estimateMinutes || 60) / 6),
      },
    ]

    const intervention: Intervention = {
      id: generateId(),
      taskId,
      message: `你已闲置一段时间。"${task.title}"已推迟${task.postponeCount}次，让我们把它拆分成更小的步骤来完成吧！`,
      subTasks,
      triggeredAt: new Date().toISOString(),
    }

    mockInterventions.push(intervention)
    return { success: true, data: intervention }
  },

  /**
   * Mock respond to intervention
   */
  async respondToIntervention(
    _interventionId: string,
    _response: InterventionResponse
  ): Promise<ApiResponse<void>> {
    await delay(200)
    return { success: true, data: undefined }
  },

  /**
   * Mock get intervention history
   */
  async getInterventionHistory(): Promise<ApiResponse<Intervention[]>> {
    await delay(300)
    return { success: true, data: mockInterventions }
  },

  // ===== Heartbeat =====

  /**
   * Mock heartbeat
   */
  async heartbeat(): Promise<ApiResponse<{ userId: string; timestamp: string }>> {
    await delay(100)
    if (!mockUser) {
      throw new Error('未登录')
    }
    return {
      success: true,
      data: { userId: mockUser.id, timestamp: new Date().toISOString() },
    }
  },

  // ===== Daily Review =====

  /**
   * Mock submit daily review
   */
  async submitDailyReview(
    answers: string[]
  ): Promise<ApiResponse<DailyReview>> {
    await delay(800)

    // Calculate mock stats
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const stats: ReviewStats = {
      completedTasksCount: mockTasks.filter((t) => t.status === 'completed').length,
      focusMinutes: mockSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0),
      procrastinationCount: mockInterventions.filter(
        (i) => new Date(i.triggeredAt) >= todayStart
      ).length,
      tasksCreatedCount: mockTasks.filter(
        (t) => new Date(t.createdAt) >= todayStart
      ).length,
    }

    const suggestions: AgentSuggestions = {
      suggestions: [
        '今天你完成了不少工作，继续保持这个节奏！',
        '建议尝试将大任务拆分成小任务，可以减少拖延。',
      ],
      improvements: [
        '可以尝试在精力最好的时段处理高优先级任务。',
        '减少任务切换，专注完成当前任务再开始下一个。',
      ],
    }

    const review: DailyReview = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      questions: [
        { id: generateId(), question: '今天最有成就感的是什么？', answer: answers[0] },
        { id: generateId(), question: '今天遇到了什么困难？', answer: answers[1] },
        { id: generateId(), question: '明天有什么计划？', answer: answers[2] },
      ],
      stats,
      suggestions,
      createdAt: new Date().toISOString(),
    }

    mockReviews.push(review)
    return { success: true, data: review }
  },

  /**
   * Mock get daily review
   */
  async getDailyReview(date: string): Promise<ApiResponse<DailyReview>> {
    await delay(300)

    const review = mockReviews.find((r) => r.date === date)
    if (!review) {
      throw new Error('该日期的复盘不存在')
    }

    return { success: true, data: review }
  },

  /**
   * Mock get review history
   */
  async getReviewHistory(): Promise<ApiResponse<DailyReview[]>> {
    await delay(300)
    return { success: true, data: mockReviews }
  },

  /**
   * Mock get today's stats
   */
  async getTodayStats(): Promise<ApiResponse<ReviewStats>> {
    await delay(200)

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const stats: ReviewStats = {
      completedTasksCount: mockTasks.filter(
        (t) =>
          t.status === 'completed' && new Date(t.completedAt || '') >= todayStart
      ).length,
      focusMinutes: mockSessions
        .filter((s) => new Date(s.startTs) >= todayStart)
        .reduce((sum, s) => sum + (s.durationMinutes || 0), 0),
      procrastinationCount: mockInterventions.filter(
        (i) => new Date(i.triggeredAt) >= todayStart
      ).length,
      tasksCreatedCount: mockTasks.filter(
        (t) => new Date(t.createdAt) >= todayStart
      ).length,
    }

    return { success: true, data: stats }
  },
}

// ===== Reset mock data (useful for testing) =====
export function resetMockData(): void {
  mockUser = null
  mockAccessToken = null
  mockRecommendations = []
  mockInterventions = []
  mockReviews = []
  // Reset tasks to initial state
  mockTasks.length = 0
  mockTasks.push(
    {
      id: '1',
      title: '完成项目文档',
      description: '编写 FlowPilot 项目的技术文档和用户手册',
      priority: 'high',
      status: 'pending',
      tags: ['work', 'documentation'],
      estimateMinutes: 120,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      postponeCount: 0,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: '代码评审',
      description: '审查团队提交的 PR 并提供反馈',
      priority: 'medium',
      status: 'pending',
      tags: ['work', 'code-review'],
      estimateMinutes: 45,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      postponeCount: 1,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    }
  )
  mockSessions.length = 0
}
