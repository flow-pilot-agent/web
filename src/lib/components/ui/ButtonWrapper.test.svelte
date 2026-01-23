<script lang="ts">
  import Button from './Button.svelte'

  interface Props {
    text: string
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    loading?: boolean
    fullWidth?: boolean
    onclick?: (event: MouseEvent) => void
  }

  const { text, variant, size, disabled, loading, fullWidth, onclick }: Props = $props()
</script>

<Button {variant} {size} {disabled} {loading} {fullWidth} {onclick}>
  {text}
</Button>
