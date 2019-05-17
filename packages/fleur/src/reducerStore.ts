import Store, { StoreClass, listen } from './Store'
import { ActionIdentifier, ExtractPayloadType } from './Action'
import { Draft } from 'immer'
import { StoreContext } from './StoreContext'

interface ReducerStoreClass<S> extends StoreClass<S> {
  listen<T extends ActionIdentifier<any>>(
    ident: T,
    producer: (payload: ExtractPayloadType<T>, state: Draft<S>) => void,
  ): this
}

export const reducerStore = <S>(
  storeName: string,
  initialStateFactory: () => S,
): ReducerStoreClass<S> => {
  class SubClass extends Store<S> {
    public static storeName = storeName

    public static listeners: [
      ActionIdentifier<any>,
      (payload: any, state: Draft<S>) => void
    ][] = []

    public static listen<T extends ActionIdentifier<any>>(
      ident: T,
      producer: (payload: ExtractPayloadType<T>, state: Draft<S>) => void,
    ) {
      SubClass.listeners.push([ident, producer])
      return this
    }

    constructor(protected context: StoreContext) {
      super(context)

      this.state = initialStateFactory()

      SubClass.listeners.forEach(([ident, producer], idx) => {
        ;(this as any)[`__handler_${idx}_${ident.name}`] = listen(
          ident,
          payload => {
            this.updateWith(d => producer(payload, d))
          },
        )
      })
    }
  }

  return SubClass
}
