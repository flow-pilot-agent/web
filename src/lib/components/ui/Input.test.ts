import { render, fireEvent } from '@testing-library/svelte'
import { describe, it, expect } from 'vitest'
import Input from './Input.svelte'

describe('Input', () => {
  it('renders with label', () => {
    const { container } = render(Input, { props: { label: 'Email', value: '' } })
    const label = container.querySelector('label')
    expect(label?.textContent).toContain('Email')
  })

  it('renders input with correct type', () => {
    const { container } = render(Input, { props: { type: 'password', value: '' } })
    const input = container.querySelector('input')
    expect(input?.type).toBe('password')
  })

  it('renders with default text type', () => {
    const { container } = render(Input, { props: { value: '' } })
    const input = container.querySelector('input')
    expect(input?.type).toBe('text')
  })

  it('displays placeholder', () => {
    const { container } = render(Input, { props: { placeholder: 'Enter email', value: '' } })
    const input = container.querySelector('input')
    expect(input?.placeholder).toBe('Enter email')
  })

  it('displays error message', () => {
    const { container } = render(Input, { props: { error: 'Invalid email', value: '' } })
    const errorEl = container.querySelector('.text-danger')
    expect(errorEl?.textContent).toContain('Invalid email')
  })

  it('applies error border when error exists', () => {
    const { container } = render(Input, { props: { error: 'Error', value: '' } })
    const input = container.querySelector('input')
    expect(input?.className).toContain('border-danger')
  })

  it('applies normal border when no error', () => {
    const { container } = render(Input, { props: { value: '' } })
    const input = container.querySelector('input')
    expect(input?.className).toContain('border-gray-300')
  })

  it('applies disabled state', () => {
    const { container } = render(Input, { props: { disabled: true, value: '' } })
    const input = container.querySelector('input')
    expect(input?.disabled).toBe(true)
    expect(input?.className).toContain('opacity-50')
  })

  it('applies required attribute', () => {
    const { container } = render(Input, { props: { required: true, value: '' } })
    const input = container.querySelector('input')
    expect(input?.required).toBe(true)
  })

  it('handles input event', async () => {
    const { container } = render(Input, { props: { value: '' } })
    const input = container.querySelector('input') as HTMLInputElement

    await fireEvent.input(input, { target: { value: 'test@example.com' } })

    expect(input.value).toBe('test@example.com')
  })

  it('shows required indicator when required', () => {
    const { container } = render(Input, { props: { label: 'Email', required: true, value: '' } })
    const label = container.querySelector('label')
    expect(label?.textContent).toContain('*')
  })

  it('applies full width class', () => {
    const { container } = render(Input, { props: { fullWidth: true, value: '' } })
    const wrapper = container.querySelector('div')
    expect(wrapper?.className).toContain('w-full')
  })

  it('sets autocomplete attribute', () => {
    const { container } = render(Input, { props: { autocomplete: 'email', value: '' } })
    const input = container.querySelector('input')
    expect(input?.autocomplete).toBe('email')
  })

  it('has correct ARIA attributes when error exists', () => {
    const { container } = render(Input, { props: { error: 'Invalid', value: '' } })
    const input = container.querySelector('input')
    expect(input?.getAttribute('aria-invalid')).toBe('true')
    expect(input?.getAttribute('aria-describedby')).toBeTruthy()
  })
})
