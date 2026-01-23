import { render, fireEvent } from '@testing-library/svelte'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button.svelte'
import ButtonWrapper from './ButtonWrapper.test.svelte'

describe('Button', () => {
  it('renders with default props', () => {
    const { getByRole } = render(ButtonWrapper, { props: { text: 'Click me' } })
    const button = getByRole('button')
    expect(button).toBeTruthy()
    expect(button.textContent).toContain('Click me')
  })

  it('applies primary variant class by default', () => {
    const { getByRole } = render(ButtonWrapper, { props: { text: 'Primary' } })
    const button = getByRole('button')
    expect(button.className).toContain('bg-primary-600')
  })

  it('applies secondary variant class', () => {
    const { getByRole } = render(ButtonWrapper, {
      props: { variant: 'secondary', text: 'Secondary' },
    })
    const button = getByRole('button')
    expect(button.className).toContain('bg-gray-200')
  })

  it('applies success variant class', () => {
    const { getByRole } = render(ButtonWrapper, { props: { variant: 'success', text: 'Success' } })
    const button = getByRole('button')
    expect(button.className).toContain('bg-success')
  })

  it('applies danger variant class', () => {
    const { getByRole } = render(ButtonWrapper, { props: { variant: 'danger', text: 'Danger' } })
    const button = getByRole('button')
    expect(button.className).toContain('bg-danger')
  })

  it('applies ghost variant class', () => {
    const { getByRole } = render(ButtonWrapper, { props: { variant: 'ghost', text: 'Ghost' } })
    const button = getByRole('button')
    expect(button.className).toContain('bg-transparent')
  })

  it('applies small size class', () => {
    const { getByRole } = render(ButtonWrapper, { props: { size: 'sm', text: 'Small' } })
    const button = getByRole('button')
    expect(button.className).toContain('px-3')
    expect(button.className).toContain('py-1.5')
  })

  it('applies medium size class by default', () => {
    const { getByRole } = render(ButtonWrapper, { props: { text: 'Medium' } })
    const button = getByRole('button')
    expect(button.className).toContain('px-4')
    expect(button.className).toContain('py-2')
  })

  it('applies large size class', () => {
    const { getByRole } = render(ButtonWrapper, { props: { size: 'lg', text: 'Large' } })
    const button = getByRole('button')
    expect(button.className).toContain('px-6')
    expect(button.className).toContain('py-3')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const { getByRole } = render(ButtonWrapper, {
      props: {
        text: 'Click',
        onclick: handleClick,
      },
    })
    const button = getByRole('button')
    await fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('shows loading state', () => {
    const { getByRole } = render(Button, { props: { loading: true } })
    const button = getByRole('button') as HTMLButtonElement
    expect(button.disabled).toBe(true)
    expect(button.textContent).toContain('加载中')
  })

  it('applies disabled state', () => {
    const { getByRole } = render(ButtonWrapper, { props: { disabled: true, text: 'Disabled' } })
    const button = getByRole('button') as HTMLButtonElement
    expect(button.disabled).toBe(true)
    expect(button.className).toContain('opacity-50')
  })

  it('applies full width class', () => {
    const { getByRole } = render(ButtonWrapper, { props: { fullWidth: true, text: 'Full Width' } })
    const button = getByRole('button')
    expect(button.className).toContain('w-full')
  })

  it('does not trigger click when disabled', async () => {
    const handleClick = vi.fn()
    const { getByRole } = render(ButtonWrapper, {
      props: {
        disabled: true,
        text: 'Disabled',
        onclick: handleClick,
      },
    })
    const button = getByRole('button')
    await fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not trigger click when loading', async () => {
    const handleClick = vi.fn()
    const { getByRole } = render(Button, {
      props: {
        loading: true,
        onclick: handleClick,
      },
    })
    const button = getByRole('button')
    await fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })
})
