<script lang="ts">
  type CardPadding = 'none' | 'sm' | 'md' | 'lg'

  interface Props {
    padding?: CardPadding
    hoverable?: boolean
    clickable?: boolean
    onclick?: (event: MouseEvent) => void
    children?: import('svelte').Snippet
    class?: string
  }

  const {
    padding = 'sm',
    hoverable = false,
    clickable = false,
    onclick,
    children,
    class: className,
  }: Props = $props()

  const paddingClasses: Record<CardPadding, string> = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const cardClasses = $derived(
    [
      'bg-white rounded-lg shadow border border-gray-200',
      'dark:bg-gray-800 dark:border-gray-700',
      paddingClasses[padding],
      hoverable && 'hover:shadow-md transition-shadow duration-200',
      clickable && 'cursor-pointer',
      className,
    ]
      .filter(Boolean)
      .join(' ')
  )
</script>

<button
  class={cardClasses}
  {onclick}
  role={clickable || onclick ? 'button' : undefined}
  tabindex={clickable || onclick ? 0 : undefined}
>
  {@render children?.()}
</button>
