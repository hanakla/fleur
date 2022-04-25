import { Store } from './Store'

export class StoreContext {
  private updateQueue = new Set<Store>()
  private animateId: number = -1
  private batch = (cb: () => void) => cb()

  public injectBatch(batch: (cb: () => void) => void) {
    this.batch = batch
  }

  public enqueueToUpdate(store: Store) {
    this.updateQueue.add(store)

    if (typeof requestAnimationFrame === 'function') {
      // batched update in client side
      cancelAnimationFrame(this.animateId)
      this.animateId = requestAnimationFrame(this.dispatchChange)
    } else {
      this.dispatchChange()
    }
  }

  private dispatchChange = () => {
    if (this.updateQueue.size <= 0) return

    this.batch(() => {
      this.updateQueue.forEach((store) => store._emit())
      this.updateQueue.clear()
    })
  }
}
