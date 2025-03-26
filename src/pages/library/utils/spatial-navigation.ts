import { delay } from 'es-toolkit'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import SpatialNavigation, { type Direction } from 'spatial-navigation-ts'

function isFocusable(element: unknown): element is HTMLElement {
  const focusableElements = [HTMLAnchorElement, HTMLButtonElement]
  const focusable =
    focusableElements.some((clazz) => element instanceof clazz) ||
    (element instanceof Element && element.getAttribute('tabindex'))
  if (!focusable || !(element instanceof Element) || !element.isConnected) {
    return false
  }
  if ('disabled' in element && element.disabled) {
    return false
  }
  return !element.ariaDisabled
}

export function click(element: unknown) {
  const focusable = isFocusable(element)
  if (focusable) {
    element.click()
  }
}

export function focus(element: unknown) {
  if (typeof element === 'string') {
    focus(document.body.querySelector(element))
    return
  }
  if (element === document.activeElement) {
    return
  }
  const focusable = isFocusable(element)
  if (focusable) {
    element.focus({ preventScroll: true })
  }
}

export function cancel() {
  alert('not implemented yet')
}

let moving = false
export function move(direction?: Direction) {
  if (moving || !direction) {
    return
  }
  resetFocus()
  if (!document.activeElement) {
    return
  }
  const currentActiveElement = document.activeElement
  return new Promise<void>((resolve) => {
    async function handleWillFocus(event: Event) {
      moving = true
      focus(currentActiveElement)
      const nextActiveElement = event.target
      event.preventDefault()
      if (nextActiveElement instanceof HTMLElement) {
        const { block, scrollMode } = nextActiveElement.dataset
        await scrollIntoView(nextActiveElement, {
          block: (block as any) || 'nearest',
          duration: 200,
          scrollMode: (scrollMode as any) || 'if-needed',
        })
        await delay(100)
      }
      focus(nextActiveElement)
      moving = false
      document.body.removeEventListener('sn:willfocus', handleWillFocus, true)
      resolve()
    }
    document.body.addEventListener('sn:willfocus', handleWillFocus, true)
    SpatialNavigation.move(direction)
  })
}

export function resetFocus({ force }: { force?: boolean } = {}) {
  if (document.activeElement === document.body || force) {
    const button =
      document.querySelector<HTMLElement>('.game-entry') || document.querySelector<HTMLElement>('main button, main a')
    if (button) {
      focus(button)
    }
  }
}

export function init() {
  SpatialNavigation.add({ selector: 'a, button' })
  resetFocus()
}
