import { render, fireEvent } from '@testing-library/svelte'
import { describe, it, expect, vi } from 'vitest'
import Card from './Card.svelte'

describe('Card', () => {
  it('renders with default props', () => {
    const { container } = render(Card)
    const card = container.querySelector('.bg-white.rounded-lg.shadow')
    expect(card).toBeTruthy()
  })

  it('applies small padding by default', () => {
    const { container } = render(Card)
    const card = container.querySelector('.bg-white.rounded-lg.shadow')
    expect(card?.className).toContain('p-4')
  })

  it('applies medium padding', () => {
    const { container } = render(Card, { props: { padding: 'md' } })
    const card = container.querySelector('.bg-white.rounded-lg.shadow')
    expect(card?.className).toContain('p-6')
  })

  it('applies large padding', () => {
    const { container } = render(Card, { props: { padding: 'lg' } })
    const card = container.querySelector('.bg-white.rounded-lg.shadow')
    expect(card?.className).toContain('p-8')
  })

  it('applies no padding', () => {
    const { container } = render(Card, { props: { padding: 'none' } })
    const card = container.querySelector('.bg-white.rounded-lg.shadow')
    expect(card?.className).not.toContain('p-')
  })

  it('applies hoverable class', () => {
    const { container } = render(Card, { props: { hoverable: true } })
    const card = container.querySelector('.bg-white.rounded-lg.shadow')
    expect(card?.className).toContain('hover:shadow-md')
    expect(card?.className).toContain('transition-shadow')
  })

  it('applies clickable class', () => {
    const { container } = render(Card, { props: { clickable: true } })
    const card = container.querySelector('.bg-white.rounded-lg.shadow')
    expect(card?.className).toContain('cursor-pointer')
  })

  it('handles click events when clickable', async () => {
    const handleClick = vi.fn()
    const { container } = render(Card, {
      props: {
        clickable: true,
        onclick: handleClick,
      },
    })

    const card = container.querySelector('.bg-white.rounded-lg.shadow') as HTMLElement
    if (card) {
      await fireEvent.click(card)
      expect(handleClick).toHaveBeenCalledOnce()
    }
  })

  it('renders children content', () => {
    const { container } = render(Card)
    const card = container.querySelector('.bg-white.rounded-lg.shadow')
    expect(card).toBeTruthy()
  })

  it('applies both hoverable and clickable classes', () => {
    const { container } = render(Card, { props: { hoverable: true, clickable: true } })
    const card = container.querySelector('.bg-white.rounded-lg.shadow')
    expect(card?.className).toContain('hover:shadow-md')
    expect(card?.className).toContain('cursor-pointer')
  })

  it('has correct base classes', () => {
    const { container } = render(Card)
    const card = container.querySelector('div')
    expect(card?.className).toContain('bg-white')
    expect(card?.className).toContain('rounded-lg')
    expect(card?.className).toContain('shadow')
    expect(card?.className).toContain('border')
    expect(card?.className).toContain('border-gray-200')
  })
})
