import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import SpatialNavigation, { type Direction } from 'spatial-navigation-ts'

function isFocusable(element: unknown): element is HTMLElement {
  const focusableElements = [HTMLAnchorElement, HTMLButtonElement, HTMLInputElement]
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

type CancelHandler = () => void
let cancelHandler: CancelHandler | undefined
export function onCancel(handler: CancelHandler) {
  cancelHandler = handler
}
export function offCancel() {
  cancelHandler = undefined
}
export function cancel() {
  try {
    if (cancelHandler) {
      cancelHandler()
    } else {
      globalThis.history.back()
    }
  } catch {}
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
        await scrollIntoView(nextActiveElement, {
          block: 'center',
          duration: 300,
          scrollMode: 'if-needed',
        })
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
  // @ts-expect-error force retrieving dataset
  if (!document.activeElement?.dataset.snEnabled || force) {
    const selectors = ['.game-entry', '.launch-button', '.sidebar-link.active']
    for (const selector of selectors) {
      const element = document.querySelector(selector)
      if (element) {
        focus(selector)
        return
      }
    }
  }
}

export function init() {
  SpatialNavigation.add({
    restrict: 'self-only',
    selector: '.library-layout [data-sn-enabled]',
  })

  SpatialNavigation.add({
    restrict: 'self-only',
    selector: '.game-overlay [data-sn-enabled]',
  })

  // game-overlay
  resetFocus()
}
