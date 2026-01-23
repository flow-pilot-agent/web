<script lang="ts">
  import { onMount } from 'svelte'
  import { router, initRouter, requiresAuthRedirect, navigate } from './lib/router'
  import { authStore } from './lib/stores/authStore'
  import LoginPage from './lib/pages/LoginPage.svelte'
  import RegisterPage from './lib/pages/RegisterPage.svelte'
  import DashboardPage from './lib/pages/DashboardPage.svelte'

  /**
   * Initialize app
   */
  onMount(async () => {
    // Initialize router
    initRouter()

    // Initialize auth store
    await authStore.initialize()

    // Handle auth redirects
    if (!requiresAuthRedirect(router.currentRoute, authStore.isAuthenticated)) {
      // If on root and authenticated, redirect to dashboard
      if (router.currentRoute === '/' && authStore.isAuthenticated) {
        navigate('/dashboard')
      }
      // If on root and not authenticated, redirect to login
      else if (router.currentRoute === '/') {
        navigate('/login')
      }
    }
  })
</script>

{#if authStore.loading && !authStore.user}
  <div class="loading-screen">
    <div class="loading-spinner"></div>
    <p class="loading-text">加载中...</p>
  </div>
{:else}
  {#if router.currentRoute === '/' || router.currentRoute === '/login'}
    <LoginPage />
  {:else if router.currentRoute === '/register'}
    <RegisterPage />
  {:else if router.currentRoute === '/dashboard'}
    <DashboardPage />
  {/if}
{/if}

<style>
  * {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  }

  .loading-spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loading-text {
    margin-top: 1rem;
    color: #6b7280;
    font-size: 0.9rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
