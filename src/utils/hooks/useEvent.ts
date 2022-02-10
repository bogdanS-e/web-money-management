import { useEffect } from 'react'

const useEvent = (
  element: HTMLElement | Document | null,
  dependencies: any[],
  type: keyof HTMLElementEventMap,
  listener?: (this: HTMLInputElement, ev: Event) => any,
  options?: boolean | AddEventListenerOptions
): void => {
  useEffect(() => {
    if (!element || !listener) return

    element.addEventListener(type, listener, options)

    return () => element.removeEventListener(type, listener, options)
  }, [...dependencies, element])
}

export default useEvent
