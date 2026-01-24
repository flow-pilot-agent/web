/**
 * Theme Store
 * Manages application theme (light/dark mode)
 */

type Theme = 'light' | 'dark'

class ThemeStore {
  theme = $state<Theme>('light')
  private initialized = false

  /**
   * Initialize theme from localStorage or system preference
   * Must be called after component mount
   */
  init(): void {
    if (this.initialized || typeof window === 'undefined') return

    const savedTheme = localStorage.getItem('theme') as Theme | null
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    this.theme = savedTheme || (systemPrefersDark ? 'dark' : 'light')
    this.applyTheme()
    this.initialized = true
  }

  /**
   * Toggle between light and dark mode
   */
  toggle(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light'
    this.applyTheme()
    this.saveTheme()
  }

  /**
   * Set specific theme
   */
  setTheme(theme: Theme): void {
    this.theme = theme
    this.applyTheme()
    this.saveTheme()
  }

  /**
   * Apply theme to document
   */
  private applyTheme(): void {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    if (this.theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  /**
   * Save theme to localStorage
   */
  private saveTheme(): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('theme', this.theme)
  }

  /**
   * Get current theme as derived value
   */
  get isDark(): boolean {
    return this.theme === 'dark'
  }

  /**
   * Get current theme as derived value
   */
  get isLight(): boolean {
    return this.theme === 'light'
  }
}

export const themeStore = new ThemeStore()
