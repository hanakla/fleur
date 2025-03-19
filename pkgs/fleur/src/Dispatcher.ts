import { ActionIdentifier } from './Action'

export interface Events {
  dispatch: {
    type: ActionIdentifier<any>
    payload: any
  }
}

type Listener = (action: Events['dispatch']) => void

export default class Dispatcher {
  private listeners: Listener[] = []

  public listen = (listener: (action: Events['dispatch']) => void) => {
    this.listeners.push(listener)
  }

  public dispatch = <P>(type: ActionIdentifier<P>, payload: P) => {
    const action = { type, payload }
    this.listeners.forEach((listener) => listener(action))
  }
}
