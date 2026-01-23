/**
 * Authentication Store
 * Manages user authentication state using Svelte 5 runes
 */

import type { User } from '../api/types'
import { apiClient, getAccessToken, clearTokens } from '../api'

/**
 * Auth store state
 */
class AuthStore {
  // Reactive state
  user = $state<User | null>(null)
  loading = $state(false)
  error = $state<string | null>(null)

  // Derived state
  isAuthenticated = $derived(this.user !== null)
  userInitials = $derived(
    this.user?.displayName
      ? this.user.displayName
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : ''
  )

  /**
   * Initialize auth store from localStorage
   */
  async initialize(): Promise<void> {
    const token = getAccessToken()
    if (!token) {
      this.loading = false
      return
    }

    this.loading = true
    this.error = null

    try {
      const response = await apiClient.getCurrentUser()
      if (response.success) {
        this.user = response.data as User
      }
    } catch {
      // Token invalid or expired, clear it
      clearTokens()
      this.user = null
    } finally {
      this.loading = false
    }
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<boolean> {
    this.loading = true
    this.error = null

    try {
      const response = await apiClient.login({ email, password })

      if (response.success && response.data) {
        this.user = response.data.user
        return true
      }

      this.error = '登录失败'
      return false
    } catch (err) {
      this.error = err instanceof Error ? err.message : '登录失败，请重试'
      return false
    } finally {
      this.loading = false
    }
  }

  /**
   * Register new user
   */
  async register(email: string, password: string, displayName: string): Promise<boolean> {
    this.loading = true
    this.error = null

    try {
      const response = await apiClient.register({ email, password, displayName })

      if (response.success && response.data) {
        this.user = response.data.user
        return true
      }

      this.error = '注册失败'
      return false
    } catch (err) {
      this.error = err instanceof Error ? err.message : '注册失败，请重试'
      return false
    } finally {
      this.loading = false
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    this.loading = true

    try {
      await apiClient.logout()
    } catch {
      // Ignore logout errors
    } finally {
      this.user = null
      this.loading = false
      this.error = null
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<Pick<User, 'displayName' | 'avatarUrl'>>): Promise<boolean> {
    this.loading = true
    this.error = null

    try {
      // For now, just update local state
      // In production, this would call an API endpoint
      if (this.user) {
        this.user = { ...this.user, ...updates }
      }
      return true
    } catch (err) {
      this.error = err instanceof Error ? err.message : '更新失败'
      return false
    } finally {
      this.loading = false
    }
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.error = null
  }
}

/**
 * Global auth store instance
 */
export const authStore = new AuthStore()
