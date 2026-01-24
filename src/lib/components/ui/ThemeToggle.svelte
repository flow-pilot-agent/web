<script lang="ts">
  import { themeStore } from '../../stores/themeStore.svelte'
  import Icon from '@iconify/svelte'

  interface Props {
    size?: 'sm' | 'md' | 'lg'
  }

  let { size = 'md' }: Props = $props()

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  // Derive the current theme state
  let isDark = $derived(themeStore.theme === 'dark')
  let currentIcon = $derived(isDark ? 'lucide:sun' : 'lucide:moon')
  let ariaLabel = $derived(isDark ? '切换到亮色模式' : '切换到暗色模式')

  function toggleTheme(): void {
    themeStore.toggle()
  }
</script>

<button
  type="button"
  class="theme-toggle {sizeClasses[size]}"
  onclick={toggleTheme}
  aria-label={ariaLabel}
  title={ariaLabel}
>
  <Icon icon={currentIcon} class={iconSizes[size]} />
</button>

<style>
  .theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #f3f4f6;
    color: #111827;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .theme-toggle:hover {
    background-color: #e5e7eb;
    transform: scale(1.05);
  }

  .theme-toggle:active {
    transform: scale(0.95);
  }

  /* Dark mode styles */
  @media (prefers-color-scheme: dark) {
    .theme-toggle {
      background-color: #374151;
      color: #f9fafb;
    }

    .theme-toggle:hover {
      background-color: #4b5563;
    }
  }

  :global(.dark) .theme-toggle {
    background-color: #374151;
    color: #f9fafb;
  }

  :global(.dark) .theme-toggle:hover {
    background-color: #4b5563;
  }
</style>
