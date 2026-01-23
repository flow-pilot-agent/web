<script lang="ts">
  import AuthForm from '../components/auth/AuthForm.svelte'
  import Icon from '@iconify/svelte'
  import { authStore } from '../stores/authStore.svelte.js'
  import { navigate } from '../router'
  import type { LoginInput } from '../utils/validation'

  /**
   * Handle login form submission
   */
  async function handleSubmit(data: LoginInput): Promise<void> {
    const success = await authStore.login(data.email, data.password)

    if (success) {
      // Navigate to dashboard on successful login
      navigate('/dashboard')
    }
  }

  /**
   * Navigate to register page
   */
  function goToRegister(): void {
    navigate('/register')
  }
</script>

<div class="login-page">
  <div class="login-page-container">
    <div class="login-page-logo">
      <Icon icon="lucide:zap" class="logo-icon" />
      <h1 class="logo-text">FlowPilot</h1>
    </div>

    <AuthForm
      mode="login"
      loading={authStore.loading}
      error={authStore.error}
      onSubmit={handleSubmit}
      onSwitchMode={goToRegister}
      switchModeText="立即注册"
    >
      <div class="login-page-footer">
        <p class="login-page-hint">
          测试账号: test@example.com / password123
        </p>
      </div>
    </AuthForm>

    <div class="login-page-demo">
      <p class="login-page-demo-text">
        这是 FlowPilot 前端演示版本
      </p>
    </div>
  </div>
</div>

<style>
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  }

  .login-page-container {
    width: 100%;
    max-width: 28rem;
  }

  .login-page-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .logo-icon {
    width: 3.5rem;
    height: 3.5rem;
    color: #3b82f6;
  }

  .logo-text {
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.025em;
  }

  .login-page-footer {
    margin-top: 0.5rem;
  }

  .login-page-hint {
    text-align: center;
    color: #9ca3af;
    font-size: 0.8rem;
    background-color: rgba(59, 130, 246, 0.05);
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
  }

  .login-page-demo {
    margin-top: 2rem;
    text-align: center;
  }

  .login-page-demo-text {
    color: #9ca3af;
    font-size: 0.8rem;
  }
</style>
