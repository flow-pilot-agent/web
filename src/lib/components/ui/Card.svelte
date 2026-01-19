<script lang="ts">
  type CardPadding = 'none' | 'sm' | 'md' | 'lg'

  interface Props {
    padding?: CardPadding
    hoverable?: boolean
    clickable?: boolean
    onclick?: (event: MouseEvent) => void
    children?: import('svelte').Snippet
  }

  const {
    padding = 'sm',
    hoverable = false,
    clickable = false,
    onclick,
    children,
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
      paddingClasses[padding],
      hoverable && 'hover:shadow-md transition-shadow duration-200',
      clickable && 'cursor-pointer',
    ]
      .filter(Boolean)
      .join(' ')
  )
</script>

<div class={cardClasses} {onclick}>
  {@render children?.()}
</div>
