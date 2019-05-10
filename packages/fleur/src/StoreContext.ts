import Store from './Store'

export class StoreContext {
  private updateQueue = new Set<Store>()
  private animateId: number = -1

  public enqueueToUpdate(store: Store) {
    this.updateQueue.add(store)

    if (typeof requestAnimationFrame === 'function') {
      // batched update in client side
      cancelAnimationFrame(this.animateId)
      requestAnimationFrame(this.dispatchChange)
    } else {
      this.dispatchChange()
    }
  }

  private dispatchChange = () => {
    if (this.updateQueue.size <= 0) return
    this.updateQueue.forEach(store => store.emit('onChange', void 0))
    this.updateQueue.clear()
  }
}
