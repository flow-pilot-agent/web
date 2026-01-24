<script lang="ts">
  interface Props {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date'
    placeholder?: string
    value?: string | number
    disabled?: boolean
    error?: string
    label?: string
    id?: string
    name?: string
    required?: boolean
    autocomplete?: string
    fullWidth?: boolean
    min?: string | number
    max?: string | number
    class?: string
    oninput?: (event: Event & { currentTarget: HTMLInputElement }) => void
    onblur?: () => void
    onkeydown?: (event: KeyboardEvent) => void
  }

  let {
    type = 'text',
    placeholder,
    value = $bindable(''),
    disabled = false,
    error,
    label,
    id,
    name,
    required = false,
    fullWidth = true,
    min,
    max,
    class: className,
    oninput,
    onblur,
    onkeydown,
  }: Props = $props()

  const inputId = $derived(id || name || `input-${Math.random().toString(36).substring(2, 11)}`)

  const inputClasses = $derived(
    [
      'block w-full rounded-md border px-3 py-2',
      'text-gray-900 placeholder-gray-400',
      'dark:text-gray-100 dark:placeholder-gray-500 dark:bg-gray-800',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'transition-colors duration-150',
      'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 disabled:opacity-50',
      'dark:disabled:bg-gray-900 dark:disabled:text-gray-600',
      error
        ? 'border-danger focus:border-danger focus:ring-danger dark:border-danger-light'
        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:focus:border-primary-400',
      className,
    ]
      .filter(Boolean)
      .join(' ')
  )
</script>

<div class={fullWidth ? 'w-full' : ''}>
  {#if label}
    <label for={inputId} class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
      {#if required}
        <span class="text-danger">*</span>
      {/if}
    </label>
  {/if}

  <input
    {type}
    id={inputId}
    {name}
    {placeholder}
    {disabled}
    {required}
    {min}
    {max}
    {onblur}
    {onkeydown}
    bind:value
    {oninput}
    class={inputClasses}
    aria-invalid={error ? 'true' : 'false'}
    aria-describedby={error ? `${inputId}-error` : undefined}
  />

  {#if error}
    <p id="{inputId}-error" class="text-danger mt-1 text-sm">
      {error}
    </p>
  {/if}
</div>
