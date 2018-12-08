import { action } from '@ragg/fleur'
import { Action } from 'history'

export interface NavigationPayload {
  url: string
  type?: Action
  error?: Error
}

// Action payloads
export const navigateStart = action<NavigationPayload>()
export const navigateSuccess = action<NavigationPayload>()
export const navigateFailure = action<NavigationPayload>()
