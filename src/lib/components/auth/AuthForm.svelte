<script lang="ts">
  import Input from '../ui/Input.svelte'
  import Button from '../ui/Button.svelte'
  import Icon from '@iconify/svelte'
  import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '../../utils/validation'
  import type { Snippet } from 'svelte'

  type AuthMode = 'login' | 'register'

  interface Props {
    mode: AuthMode
    loading?: boolean
    error?: string | null
    onSubmit: (data: LoginInput | RegisterInput) => Promise<void>
    onSwitchMode?: () => void
    switchModeText?: string
    children?: Snippet
  }

  let {
    mode,
    loading = false,
    error,
    onSubmit,
    onSwitchMode,
    switchModeText,
    children,
  }: Props = $props()

  // Form data
  let email = $state('')
  let password = $state('')
  let confirmPassword = $state('')
  let displayName = $state('')

  // Validation errors
  let emailError = $state('')
  let passwordError = $state('')
  let confirmPasswordError = $state('')
  let displayNameError = $state('')

  // Show password toggle
  let showPassword = $state(false)

  const isLogin = $derived(mode === 'login')
  const title = $derived(isLogin ? '欢迎回来' : '创建账户')
  const buttonText = $derived(isLogin ? '登录' : '注册')

  /**
   * Validate email
   */
  function validateEmail(): boolean {
    const result = loginSchema.shape.email.safeParse(email)
    emailError = result.success ? '' : (result.error.issues[0]?.message || '')
    return result.success
  }

  /**
   * Validate password
   */
  function validatePassword(): boolean {
    const result = loginSchema.shape.password.safeParse(password)
    passwordError = result.success ? '' : (result.error.issues[0]?.message || '')
    return result.success
  }

  /**
   * Validate confirm password (register only)
   */
  function validateConfirmPassword(): boolean {
    if (isLogin) return true
    if (password !== confirmPassword) {
      confirmPasswordError = '两次密码不一致'
      return false
    }
    confirmPasswordError = ''
    return true
  }

  /**
   * Validate display name (register only)
   */
  function validateDisplayName(): boolean {
    if (isLogin) return true
    const result = registerSchema.shape.displayName.safeParse(displayName)
    displayNameError = result.success ? '' : (result.error.issues[0]?.message || '')
    return result.success
  }

  /**
   * Handle form submission
   */
  async function handleSubmit(): Promise<void> {
    // Validate all fields
    const isEmailValid = validateEmail()
    const isPasswordValid = validatePassword()
    const isConfirmPasswordValid = validateConfirmPassword()
    const isDisplayNameValid = validateDisplayName()

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isDisplayNameValid) {
      return
    }

    const data: LoginInput | RegisterInput = isLogin
      ? { email, password }
      : { email, password, displayName }

    await onSubmit(data)
  }

  /**
   * Clear all errors
   */
  function clearErrors(): void {
    emailError = ''
    passwordError = ''
    confirmPasswordError = ''
    displayNameError = ''
  }

  // Clear error when user starts typing
  $effect(() => {
    if (email && emailError) {
      validateEmail()
    }
  })

  $effect(() => {
    if (password && passwordError) {
      validatePassword()
    }
  })

  $effect(() => {
    if (confirmPassword && confirmPasswordError) {
      validateConfirmPassword()
    }
  })

  $effect(() => {
    if (displayName && displayNameError) {
      validateDisplayName()
    }
  })

  $effect(() => {
    if (error) {
      clearErrors()
    }
  })
</script>

<div class="auth-form">
  <div class="auth-form-header">
    <h1 class="auth-form-title">{title}</h1>
    <p class="auth-form-subtitle">
      {isLogin ? '输入您的账号信息登录' : '填写信息创建新账户'}
    </p>
  </div>

  <form class="auth-form-form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    {#if !isLogin}
      <Input
        id="displayName"
        name="displayName"
        label="显示名称"
        type="text"
        placeholder="请输入显示名称"
        bind:value={displayName}
        error={displayNameError}
        onblur={() => validateDisplayName()}
      />
    {/if}

    <Input
      id="email"
      name="email"
      label="邮箱"
      type="email"
      placeholder="请输入邮箱地址"
      autocomplete={isLogin ? 'email' : 'username'}
      bind:value={email}
      error={emailError}
      onblur={() => validateEmail()}
    />

    <div class="auth-form-password">
      <Input
        id="password"
        name="password"
        label="密码"
        type={showPassword ? 'text' : 'password'}
        placeholder="请输入密码"
        autocomplete={isLogin ? 'current-password' : 'new-password'}
        bind:value={password}
        error={passwordError}
        onblur={() => validatePassword()}
      />
      <button
        type="button"
        class="auth-form-password-toggle"
        onclick={() => showPassword = !showPassword}
        aria-label={showPassword ? '隐藏密码' : '显示密码'}
      >
        {#if showPassword}
          <Icon icon="lucide:eye-off" class="h-5 w-5" />
        {:else}
          <Icon icon="lucide:eye" class="h-5 w-5" />
        {/if}
      </button>
    </div>

    {#if !isLogin}
      <Input
        id="confirmPassword"
        name="confirmPassword"
        label="确认密码"
        type="password"
        placeholder="请再次输入密码"
        autocomplete="new-password"
        bind:value={confirmPassword}
        error={confirmPasswordError}
        onblur={() => validateConfirmPassword()}
      />
    {/if}

    {#if error}
      <div class="auth-form-error">
        <Icon icon="lucide:alert-circle" class="auth-form-error-icon" />
        <span class="auth-form-error-text">{error}</span>
      </div>
    {/if}

    <Button
      type="submit"
      variant="primary"
      size="lg"
      fullWidth
      loading={loading}
      disabled={loading}
    >
      {loading ? '处理中...' : buttonText}
    </Button>

    {#if onSwitchMode}
      <div class="auth-form-switch">
        <span class="auth-form-switch-text">
          {isLogin ? '还没有账户？' : '已有账户？'}
        </span>
        <button
          type="button"
          class="auth-form-switch-link"
          onclick={onSwitchMode}
          disabled={loading}
        >
          {switchModeText || (isLogin ? '立即注册' : '立即登录')}
        </button>
      </div>
    {/if}

    {#if children}
      {@render children()}
    {/if}
  </form>
</div>

<style>
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .auth-form-header {
    text-align: center;
  }

  .auth-form-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .auth-form-subtitle {
    color: #6b7280;
    font-size: 0.95rem;
  }

  .auth-form-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .auth-form-password {
    position: relative;
  }

  .auth-form-password-toggle {
    position: absolute;
    right: 0.75rem;
    top: 2.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    transition: color 0.15s;
  }

  .auth-form-password-toggle:hover {
    color: #374151;
  }

  .auth-form-password-toggle:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6;
  }

  .auth-form-error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.375rem;
    color: #dc2626;
    font-size: 0.875rem;
  }

  .auth-form-error-icon {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
  }

  .auth-form-error-text {
    flex: 1;
  }

  .auth-form-switch {
    display: flex;
    justify-content: center;
    gap: 0.25rem;
    font-size: 0.9rem;
  }

  .auth-form-switch-text {
    color: #6b7280;
  }

  .auth-form-switch-link {
    background: none;
    border: none;
    cursor: pointer;
    color: #2563eb;
    font-weight: 500;
    padding: 0;
    font-size: inherit;
    transition: color 0.15s;
  }

  .auth-form-switch-link:hover:not(:disabled) {
    color: #1d4ed8;
    text-decoration: underline;
  }

  .auth-form-switch-link:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
