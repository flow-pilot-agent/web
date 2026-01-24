/**
 * Task Store
 * Manages task list, current task, and timer state using Svelte 5 runes
 */

import type { Task, TaskSession, CreateTaskInput, UpdateTaskInput, TaskPriority as TaskPriorityType, TaskStatus as TaskStatusType } from '../api/types'
import { apiClient } from '../api'

// Re-export types for use in components
export type TaskPriority = TaskPriorityType
export type TaskStatus = TaskStatusType

/**
 * Timer state
 */
type TimerState = 'idle' | 'running' | 'paused'

/**
 * Filter options
 */
export interface TaskFilters {
  status?: TaskStatus | 'all'
  priority?: TaskPriority | 'all'
  searchQuery?: string
}

/**
 * Task store state
 */
class TaskStore {
  // Reactive state
  tasks = $state<Task[]>([])
  currentTask = $state<Task | null>(null)
  timerState = $state<TimerState>('idle')
  timerSeconds = $state(0)
  timerSession = $state<TaskSession | null>(null)
  filter = $state<TaskFilters>({ status: 'all', priority: 'all', searchQuery: '' })
  loading = $state(false)
  error = $state<string | null>(null)

  // Derived state - filtered tasks
  get filteredTasks(): Task[] {
    return this.tasks.filter((task) => {
      // Filter by status
      if (this.filter.status && this.filter.status !== 'all' && task.status !== this.filter.status) {
        return false
      }

      // Filter by priority
      if (this.filter.priority && this.filter.priority !== 'all' && task.priority !== this.filter.priority) {
        return false
      }

      // Filter by search query
      if (this.filter.searchQuery) {
        const query = this.filter.searchQuery.toLowerCase()
        const matchesTitle = task.title.toLowerCase().includes(query)
        const matchesDescription = task.description?.toLowerCase().includes(query) || false
        const matchesTags = task.tags?.some((tag: string) => tag.toLowerCase().includes(query)) || false
        if (!matchesTitle && !matchesDescription && !matchesTags) {
          return false
        }
      }

      return true
    })
  }

  // Derived state - task counts
  totalTasksCount = $derived(this.tasks.length)
  completedTasksCount = $derived(this.tasks.filter((t) => t.status === 'completed').length)
  inProgressTasksCount = $derived(this.tasks.filter((t) => t.status === 'in_progress').length)
  pendingTasksCount = $derived(this.tasks.filter((t) => t.status === 'pending').length)
  overdueTasksCount = $derived(
    this.tasks.filter((t) => {
      if (!t.dueDate) return false
      return new Date(t.dueDate) < new Date() && t.status !== 'completed'
    }).length
  )

  // Derived state - current task info
  currentTaskSessionDuration = $derived(() => {
    if (!this.currentTask) return null
    const task = this.currentTask
    const sessions = this.tasks
      .filter((t) => t.id === task.id)
      .flatMap((t) => (t as Task & { sessions?: TaskSession[] }).sessions || [])
    return sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0)
  })

  /**
   * Fetch tasks from API
   */
  async fetchTasks(): Promise<void> {
    this.loading = true
    this.error = null

    try {
      const response = await apiClient.getTasks()
      if (response.success && response.data) {
        this.tasks = response.data.tasks
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : '获取任务列表失败'
    } finally {
      this.loading = false
    }
  }

  /**
   * Create new task
   */
  async createTask(input: CreateTaskInput): Promise<Task | null> {
    this.loading = true
    this.error = null

    try {
      const response = await apiClient.createTask(input)
      if (response.success && response.data) {
        this.tasks.unshift(response.data)
        return response.data
      }
      this.error = '创建任务失败'
      return null
    } catch (err) {
      this.error = err instanceof Error ? err.message : '创建任务失败'
      return null
    } finally {
      this.loading = false
    }
  }

  /**
   * Update existing task
   */
  async updateTask(id: string, input: UpdateTaskInput): Promise<Task | null> {
    this.loading = true
    this.error = null

    try {
      const response = await apiClient.updateTask(id, input)
      if (response.success && response.data) {
        // Update task in array
        const index = this.tasks.findIndex((t) => t.id === id)
        if (index !== -1) {
          this.tasks[index] = response.data
        }

        // Update current task if needed
        if (this.currentTask?.id === id) {
          this.currentTask = response.data
        }

        return response.data
      }
      this.error = '更新任务失败'
      return null
    } catch (err) {
      this.error = err instanceof Error ? err.message : '更新任务失败'
      return null
    } finally {
      this.loading = false
    }
  }

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<boolean> {
    this.loading = true
    this.error = null

    try {
      await apiClient.deleteTask(id)

      // Remove task from array
      this.tasks = this.tasks.filter((t) => t.id !== id)

      // Clear current task if deleted
      if (this.currentTask?.id === id) {
        this.currentTask = null
        this.resetTimer()
      }

      this.error = null
      return true
    } catch (err) {
      this.error = err instanceof Error ? err.message : '删除任务失败'
      return false
    } finally {
      this.loading = false
    }
  }

  /**
   * Start timer for a task
   */
  async startTask(id: string): Promise<boolean> {
    this.loading = true
    this.error = null

    try {
      const response = await apiClient.startTask(id)
      if (response.success && response.data) {
        const task = this.tasks.find((t) => t.id === id)
        if (task) {
          // Update task status to in_progress
          task.status = 'in_progress'
          this.currentTask = task

          // Set timer state
          this.timerState = 'running'
          this.timerSeconds = 0
          this.timerSession = response.data
        }

        return true
      }

      return false
    } catch (err) {
      this.error = err instanceof Error ? err.message : '开始任务失败'
      return false
    } finally {
      this.loading = false
    }
  }

  /**
   * Pause current task
   */
  async pauseTask(): Promise<boolean> {
    if (this.timerState !== 'running') {
      return false
    }

    this.loading = true
    this.error = null

    try {
      const response = await apiClient.pauseTask()
      if (response.success && response.data) {
        this.timerState = 'paused'

        // Update session with duration
        if (this.timerSession) {
          this.timerSession = { ...response.data, durationMinutes: this.timerSeconds }
        }

        // Update task status back to pending
        if (this.currentTask) {
          this.currentTask.status = 'pending'
        }

        return true
      }

      return false
    } catch (err) {
      this.error = err instanceof Error ? err.message : '暂停任务失败'
      return false
    } finally {
      this.loading = false
    }
  }

  /**
   * Complete current task
   */
  async completeTask(id: string): Promise<boolean> {
    this.loading = true
    this.error = null

    try {
      const response = await apiClient.completeTask(id)
      if (response.success && response.data) {
        const index = this.tasks.findIndex((t) => t.id === id)
        if (index !== -1) {
          this.tasks[index] = response.data
        }

        // Clear current task and reset timer
        this.currentTask = null
        this.resetTimer()

        return true
      }

      return false
    } catch (err) {
      this.error = err instanceof Error ? err.message : '完成任务失败'
      return false
    } finally {
      this.loading = false
    }
  }

  /**
   * Reset timer state
   */
  resetTimer(): void {
    this.timerState = 'idle'
    this.timerSeconds = 0
    this.timerSession = null
  }

  /**
   * Update timer seconds (called from Timer component)
   */
  updateTimerSeconds(seconds: number): void {
    this.timerSeconds = seconds
  }

  /**
   * Set filter
   */
  setFilter(filter: TaskFilters): void {
    this.filter = { ...filter }
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.error = null
  }

  /**
   * Get task by ID
   */
  getTaskById(id: string): Task | undefined {
    return this.tasks.find((t) => t.id === id)
  }

  /**
   * Sort tasks
   */
  sortTasks(by: 'dueDate' | 'priority' | 'createdAt', order: 'asc' | 'desc' = 'asc'): void {
    this.tasks = [...this.tasks].sort((a, b) => {
      let comparison = 0

      switch (by) {
        case 'dueDate': {
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
          comparison = aDate - bDate
          break
        }

        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          comparison = (priorityOrder[a.priority as TaskPriority] || 0) - (priorityOrder[b.priority as TaskPriority] || 0)
          break
        }

        case 'createdAt': {
          const aTime = new Date(a.createdAt).getTime()
          const bTime = new Date(b.createdAt).getTime()
          comparison = aTime - bTime
          break
        }
      }

      return order === 'desc' ? -comparison : comparison
    })
  }
}

/**
 * Global task store instance
 */
export const taskStore = new TaskStore()
