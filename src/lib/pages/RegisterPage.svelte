<script lang="ts">
  import AuthForm from '../components/auth/AuthForm.svelte'
  import Icon from '@iconify/svelte'
  import { authStore } from '../stores/authStore'
  import { navigate } from '../router'
  import type { RegisterInput, LoginInput } from '../utils/validation'

  /**
   * Handle register form submission
   */
  async function handleSubmit(data: LoginInput | RegisterInput): Promise<void> {
    if ('displayName' in data) {
      const success = await authStore.register(data.email, data.password, data.displayName)
      if (success) {
        // Navigate to dashboard on successful registration
        navigate('/dashboard')
      }
    }
  }

  /**
   * Navigate to login page
   */
  function goToLogin(): void {
    navigate('/login')
  }
</script>

<div class="register-page">
  <div class="register-page-container">
    <div class="register-page-logo">
      <Icon icon="lucide:zap" class="logo-icon" />
      <h1 class="logo-text">FlowPilot</h1>
    </div>

    <AuthForm
      mode="register"
      loading={authStore.loading}
      error={authStore.error}
      onSubmit={handleSubmit}
      onSwitchMode={goToLogin}
      switchModeText="立即登录"
    />
  </div>
</div>

<style>
  .register-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  }

  .register-page-container {
    width: 100%;
    max-width: 28rem;
  }

  .register-page-logo {
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
</style>
