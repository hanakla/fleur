import { action } from '@ragg/fleur'
import { Action } from 'history'

interface NavigationPayload {
  url: string
  type?: Action
  error?: Error
}

interface NavigationSuccessPayload extends NavigationPayload {
  handler: any
}

// Action payloads
export const navigateStart = action<NavigationPayload>()
export const navigateSuccess = action<NavigationSuccessPayload>()
export const navigateFailure = action<NavigationPayload>()
