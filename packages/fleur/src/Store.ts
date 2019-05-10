import immer, { Draft } from 'immer'

import { ActionIdentifier, ExtractPayloadType } from './Action'
import Emitter from './Emitter'
import { StoreContext } from './StoreContext'

export interface StoreClass<T = {}> {
  storeName: string
  new (context: StoreContext): Store<T>
}

export const listen = <A extends ActionIdentifier<any>>(
  action: A,
  producer: (payload: ExtractPayloadType<A>) => void,
) => ({
  __fleurHandler: true,
  __action: action,
  producer,
})

export interface StoreEvents {
  onChange: void
}

export default class Store<T = any> extends Emitter<StoreEvents> {
  public static storeName: string = ''

  protected state: T
  protected requestId: number | null = null

  constructor(private context: StoreContext) {
    super()
  }

  public rehydrate(state: any): void {
    this.state = state
  }

  public dehydrate(): any {
    return this.state
  }

  public emitChange(): void {
    this.emit('onChange', void 0)
  }

  protected updateWith(producer: (draft: Draft<T>) => void): void {
    this.state = immer(this.state, draft => {
      producer(draft)
    })

    this.context.enqueueToUpdate(this)
  }
}
