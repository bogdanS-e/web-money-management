import { useEffect } from 'react'

const useEventOnToggle = (
  element: HTMLElement | Document | null,
  dependency: boolean,
  type: keyof HTMLElementEventMap,
  listener?: (this: HTMLInputElement, ev: Event) => any,
  options?: boolean | AddEventListenerOptions
): void => {
  useEffect(() => {
    if (!element || !listener) return

    if (dependency) {
      element.addEventListener(type, listener, options)
    } else {
      element.removeEventListener(type, listener, options)
    }

    return () => element.removeEventListener(type, listener, options)
  }, [dependency, element])
}

export default useEventOnToggle
