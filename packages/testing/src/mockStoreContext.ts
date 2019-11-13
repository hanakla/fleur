import { StoreContext } from '@fleur/fleur'

export const mockStoreContext = (): StoreContext => {
  const context = new StoreContext()
  context.enqueueToUpdate = store => {
    store._emit()
  }
  return context
}
