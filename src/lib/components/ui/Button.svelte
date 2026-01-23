<script lang="ts">
  type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  type ButtonSize = 'sm' | 'md' | 'lg'

  interface Props {
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    loading?: boolean
    fullWidth?: boolean
    type?: 'button' | 'submit' | 'reset'
    onclick?: (event: MouseEvent) => void
    children?: import('svelte').Snippet
  }

  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    type = 'button',
    onclick,
    children,
  }: Props = $props()

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400',
    success: 'bg-success text-white hover:bg-success-dark focus:ring-success',
    danger: 'bg-danger text-white hover:bg-danger-dark focus:ring-danger',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  }

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const buttonClasses = $derived(
    [
      'inline-flex items-center justify-center',
      'font-medium rounded-md',
      'transition-colors duration-150',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
    ]
      .filter(Boolean)
      .join(' ')
  )

  function handleClick(event: MouseEvent) {
    if (!disabled && !loading && onclick) {
      onclick(event)
    }
  }
</script>

<button {type} class={buttonClasses} disabled={disabled || loading} onclick={handleClick}>
  {#if loading}
    加载中...
  {:else}
    {@render children?.()}
  {/if}
</button>
