import Fleur, { action, listen, operation, Store } from '@fleur/fleur'

import { connectToStores } from './connectToStores'
import { createElementWithContext } from './createElementWithContext'
import { create } from 'react-test-renderer'

describe('connectToStores', () => {
  // Action Identifier
  const ident = action<{ increase: number }>()

  // Operation
  const op = operation(context => {
    context.dispatch(ident, { increase: 10 })
  })

  // Store
  const TestStore = class extends Store<{ count: number }> {
    public state = { count: 10 }

    private increase = listen(ident, payload => {
      this.updateWith(d => (d.count += payload.increase))
    })
  }

  // Component
  const Receiver = (props: { count: number; anotherProp: string }) => null
  const Connected = connectToStores(state => ({
    count: state.TestStore.count,
  }))(Receiver)

  // App
  const app = new Fleur({ stores: { TestStore } })

  it('Should passed non connected props', () => {
    const context = app.createContext()
    const element = createElementWithContext(context, Connected, {
      anotherProp: 'anotherProp',
    })
    const { root, update, unmount } = create(element)
    update(element)

    expect(root.findByType(Receiver).props).toMatchObject({
      anotherProp: 'anotherProp',
    })

    unmount()
  })

  it('Should map stores to props', async () => {
    const context = app.createContext()
    const element = createElementWithContext(context, Connected, {})
    const { root, update, unmount } = create(element)
    update(element)

    expect(root.findByType(Receiver).props).toEqual({ count: 10 })

    await context.executeOperation(op)
    await new Promise(r => requestAnimationFrame(r))

    expect(root.findByType(Receiver).props).toEqual({ count: 20 })
    unmount()
  })
})
