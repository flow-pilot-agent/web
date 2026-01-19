import { render, fireEvent } from '@testing-library/svelte'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Modal from './Modal.svelte'

describe('Modal', () => {
  beforeEach(() => {
    const modalRoot = document.createElement('div')
    modalRoot.id = 'modal-root'
    document.body.appendChild(modalRoot)
  })

  afterEach(() => {
    const modalRoot = document.getElementById('modal-root')
    if (modalRoot) {
      document.body.removeChild(modalRoot)
    }
  })

  it('does not render when open is false', () => {
    const { container } = render(Modal, { props: { open: false, title: 'Test Modal' } })
    const backdrop = container.querySelector('.fixed.inset-0')
    expect(backdrop).toBeFalsy()
  })

  it('renders when open is true', () => {
    const { container } = render(Modal, { props: { open: true, title: 'Test Modal' } })
    const backdrop = container.querySelector('.fixed.inset-0')
    expect(backdrop).toBeTruthy()
  })

  it('displays title', () => {
    const { container } = render(Modal, { props: { open: true, title: 'Test Modal' } })
    const title = container.querySelector('h2')
    expect(title?.textContent).toBe('Test Modal')
  })

  it('applies small size class', () => {
    const { container } = render(Modal, { props: { open: true, title: 'Small', size: 'sm' } })
    const modalContent = container.querySelector('.bg-white.rounded-lg')
    expect(modalContent?.className).toContain('max-w-md')
  })

  it('applies medium size class by default', () => {
    const { container } = render(Modal, { props: { open: true, title: 'Medium' } })
    const modalContent = container.querySelector('.bg-white.rounded-lg')
    expect(modalContent?.className).toContain('max-w-lg')
  })

  it('applies large size class', () => {
    const { container } = render(Modal, { props: { open: true, title: 'Large', size: 'lg' } })
    const modalContent = container.querySelector('.bg-white.rounded-lg')
    expect(modalContent?.className).toContain('max-w-2xl')
  })

  it('handles backdrop click to close', async () => {
    const handleClose = vi.fn()
    const { container } = render(Modal, {
      props: {
        open: true,
        title: 'Test',
        onclose: handleClose,
      },
    })

    const backdrop = container.querySelector('.fixed.inset-0.bg-black') as HTMLElement
    if (backdrop) {
      await fireEvent.click(backdrop)
      expect(handleClose).toHaveBeenCalled()
    }
  })

  it('does not close on content click', async () => {
    const handleClose = vi.fn()
    const { container } = render(Modal, {
      props: {
        open: true,
        title: 'Test',
        onclose: handleClose,
      },
    })

    const modalContent = container.querySelector('.bg-white.rounded-lg') as HTMLElement
    if (modalContent) {
      await fireEvent.click(modalContent)
      expect(handleClose).not.toHaveBeenCalled()
    }
  })

  it('handles close button click', async () => {
    const handleClose = vi.fn()
    const { container } = render(Modal, {
      props: {
        open: true,
        title: 'Test',
        onclose: handleClose,
      },
    })

    const closeButton = container.querySelector('button.text-gray-400') as HTMLElement
    if (closeButton) {
      await fireEvent.click(closeButton)
      expect(handleClose).toHaveBeenCalled()
    }
  })

  it('handles ESC key press', async () => {
    const handleClose = vi.fn()
    render(Modal, {
      props: {
        open: true,
        title: 'Test',
        onclose: handleClose,
      },
    })

    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalled()
  })

  it('does not close on other key press', async () => {
    const handleClose = vi.fn()
    render(Modal, {
      props: {
        open: true,
        title: 'Test',
        onclose: handleClose,
      },
    })

    await fireEvent.keyDown(document, { key: 'Enter' })
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('sets body overflow hidden when open', () => {
    render(Modal, { props: { open: true, title: 'Test' } })
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body overflow when closed', async () => {
    const { rerender } = render(Modal, { props: { open: true, title: 'Test' } })
    expect(document.body.style.overflow).toBe('hidden')

    await rerender({ open: false, title: 'Test' })
    expect(document.body.style.overflow).toBe('')
  })
})
