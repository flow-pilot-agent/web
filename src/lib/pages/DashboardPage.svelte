<script lang="ts">
  import Icon from '@iconify/svelte'
  import { authStore } from '../stores/authStore.svelte.js'
  import { navigate } from '../router'

  /**
   * Handle logout
   */
  async function handleLogout(): Promise<void> {
    await authStore.logout()
    navigate('/login')
  }
</script>

<div class="dashboard-page">
  <div class="dashboard-container">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="dashboard-logo">
        <Icon icon="lucide:zap" class="logo-icon" />
        <span class="logo-text">FlowPilot</span>
      </div>

      <div class="dashboard-user">
        <div class="user-avatar">
          {authStore.userInitials}
        </div>
        <div class="user-info">
          <span class="user-name">{authStore.user?.displayName}</span>
          <span class="user-email">{authStore.user?.email}</span>
        </div>
        <button
          class="logout-button"
          onclick={handleLogout}
          aria-label="退出登录"
        >
          <Icon icon="lucide:log-out" class="logout-icon" />
        </button>
      </div>
    </header>

    <!-- Content -->
    <main class="dashboard-content">
      <div class="dashboard-welcome">
        <h1 class="welcome-title">欢迎回来，{authStore.user?.displayName}！</h1>
        <p class="welcome-subtitle">
          您已成功登录 FlowPilot。更多功能正在开发中...
        </p>
      </div>

      <div class="dashboard-features">
        <div class="feature-card">
          <div class="feature-icon">
            <Icon icon="lucide:list-todo" />
          </div>
          <h3 class="feature-title">任务管理</h3>
          <p class="feature-description">管理您的任务和待办事项</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <Icon icon="lucide:sparkles" />
          </div>
          <h3 class="feature-title">智能推荐</h3>
          <p class="feature-description">AI 帮您决定现在该做什么</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <Icon icon="lucide:clock" />
          </div>
          <h3 class="feature-title">计时器</h3>
          <p class="feature-description">专注计时，提高效率</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <Icon icon="lucide:clipboard-list" />
          </div>
          <h3 class="feature-title">每日复盘</h3>
          <p class="feature-description">回顾今日，规划明天</p>
        </div>
      </div>
    </main>
  </div>
</div>

<style>
  .dashboard-page {
    min-height: 100vh;
    background-color: #f9fafb;
  }

  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    padding: 1rem 2rem;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .dashboard-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .logo-icon {
    width: 2rem;
    height: 2rem;
    color: #3b82f6;
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
  }

  .dashboard-user {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: #3b82f6;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .user-info {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-weight: 600;
    color: #111827;
    font-size: 0.875rem;
  }

  .user-email {
    color: #6b7280;
    font-size: 0.75rem;
  }

  .logout-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.375rem;
    color: #6b7280;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logout-button:hover {
    background-color: #f3f4f6;
    color: #dc2626;
  }

  .logout-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6;
  }

  .logout-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .dashboard-content {
    flex: 1;
    padding: 2rem;
  }

  .dashboard-welcome {
    margin-bottom: 3rem;
    text-align: center;
  }

  .welcome-title {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .welcome-subtitle {
    color: #6b7280;
    font-size: 1rem;
  }

  .dashboard-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .feature-card {
    background-color: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition: all 0.2s;
  }

  .feature-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
  }

  .feature-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    background-color: #eff6ff;
    color: #3b82f6;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .feature-icon :global(svg) {
    width: 1.5rem;
    height: 1.5rem;
  }

  .feature-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }

  .feature-description {
    color: #6b7280;
    font-size: 0.875rem;
  }

  @media (max-width: 640px) {
    .dashboard-header {
      padding: 1rem;
    }

    .user-info {
      display: none;
    }

    .dashboard-content {
      padding: 1rem;
    }

    .welcome-title {
      font-size: 1.5rem;
    }

    .dashboard-features {
      grid-template-columns: 1fr;
    }
  }
</style>
