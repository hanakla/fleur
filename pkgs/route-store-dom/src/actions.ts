import { action, actions } from '@fleur/fleur'
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
export const NavigationActions = actions('fleur-route-store-dom/Navigation', {
  navigateStart: action<NavigationPayload>(),
  navigateSuccess: action<NavigationSuccessPayload>(),
  navigateFailure: action<NavigationPayload>(),
})
