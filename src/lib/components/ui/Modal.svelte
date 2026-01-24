<script lang="ts">
  import Icon from '@iconify/svelte'

  interface Props {
    open?: boolean
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    closable?: boolean
    onClose?: () => void
    children?: import('svelte').Snippet
  }

  let {
    open = $bindable(false),
    title,
    size = 'md',
    closable = true,
    onClose,
    children,
  }: Props = $props()

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  function handleClose() {
    if (closable) {
      open = false
      onClose?.()
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget && closable) {
      handleClose()
    }
  }

  function handleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape' && closable && open) {
      handleClose()
    }
  }

  $effect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleEscape)
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  })
</script>

{#if open}
  <div
    class="bg-opacity-50 dark:bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black p-4 transition-opacity"
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby={title ? 'modal-title' : undefined}
  >
    <div
      class="relative w-full {sizeClasses[size]} rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-transform"
    >
      <!-- Header -->
      {#if title || closable}
        <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          {#if title}
            <h2 id="modal-title" class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
          {:else}
            <div></div>
          {/if}

          {#if closable}
            <button
              type="button"
              onclick={handleClose}
              class="focus:ring-primary-500 dark:focus:ring-primary-400 rounded-md p-1 text-gray-400 dark:text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 focus:ring-2 focus:outline-none"
              aria-label="Close modal"
            >
              <Icon icon="lucide:x" class="h-5 w-5" />
            </button>
          {/if}
        </div>
      {/if}

      <!-- Content -->
      <div class="px-6 py-4 dark:text-gray-100">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}
