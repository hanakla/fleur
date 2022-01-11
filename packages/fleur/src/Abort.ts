export interface Aborter {
  abort: () => void
  signal: AborterSignal
  destroy: () => void
}

export interface AborterSignal {
  readonly aborted: boolean
  onabort: (() => void) | null
  readonly signal: AbortSignal | undefined
}

export const createAborter = (): Aborter => {
  // Deferred create for server side rendering
  let controller: AbortController | null = null
  let aborted = false

  let signal: AborterSignal = {
    onabort: null,
    get aborted() {
      return aborted
    },
    get signal() {
      if (typeof AbortController === 'undefined') {
        return undefined
      }

      controller ??= new AbortController()
      return controller.signal
    },
  }

  return {
    abort: () => {
      aborted = true
      signal.onabort?.()
      controller?.abort()
    },
    signal,
    destroy: () => {
      controller = null
      ;(signal as any) = null
    },
  }
}
