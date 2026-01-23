/**
 * Simple Client-side Router
 * Since this is not SvelteKit, we use a simple hash-based router
 */

export type Route = '/' | '/login' | '/register' | '/dashboard' | '/tasks' | '/recommendation' | '/review' | '/settings'

/**
 * Navigate to a route
 */
export function navigate(path: Route): void {
  window.location.hash = path
}

/**
 * Get current route from hash
 */
export function getCurrentRoute(): Route {
  const hash = window.location.hash.slice(1) as Route
  return hash || '/'
}

/**
 * Simple router state
 */
class Router {
  currentRoute: Route = getCurrentRoute()

  /**
   * Handle hash change
   */
  handleHashChange(): void {
    this.currentRoute = getCurrentRoute()
    window.scrollTo(0, 0)
  }

  /**
   * Check if route matches
   */
  isActive(route: Route): boolean {
    return this.currentRoute === route
  }
}

/**
 * Global router instance
 */
export const router = new Router()

/**
 * Initialize router (call this in app initialization)
 */
export function initRouter(): void {
  // If there's a path (not just hash) and no hash, redirect to hash-based routing
  const path = window.location.pathname
  if (path !== '/' && !window.location.hash) {
    // Known routes that might be accessed directly via path
    const knownRoutes = ['/login', '/register', '/dashboard', '/tasks', '/recommendation', '/review', '/settings']
    if (knownRoutes.includes(path)) {
      // Use location.href to properly redirect to hash-based URL
      window.location.href = '/#' + path
      return
    }
  }

  window.addEventListener('hashchange', () => router.handleHashChange())
  router.handleHashChange()
}

/**
 * Protected route checker
 * Returns true if current route requires auth and user is not logged in
 */
export function requiresAuthRedirect(currentRoute: Route, isAuthenticated: boolean): boolean {
  const protectedRoutes: Route[] = ['/dashboard', '/tasks', '/recommendation', '/review', '/settings']
  const authOnlyRoutes: Route[] = ['/login', '/register']

  if (protectedRoutes.includes(currentRoute) && !isAuthenticated) {
    navigate('/login')
    return true
  }

  if (authOnlyRoutes.includes(currentRoute) && isAuthenticated) {
    navigate('/dashboard')
    return true
  }

  return false
}
