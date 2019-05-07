import Fleur, { action, listen, operation, Store } from '@ragg/fleur'
import * as React from 'react'

import connectToStores from './connectToStores'
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
    public static storeName = 'TestStore'

    public state = { count: 10 }

    get count() {
      return this.state.count
    }

    private increase = listen(ident, payload => {
      this.updateWith(d => (d.count += payload.increase))
    })
  }

  // Component
  const Receiver = (props: { count: number; anotherProp: string }) => null
  const Connected = connectToStores([TestStore], getStore => ({
    count: getStore(TestStore).count,
  }))(Receiver)

  // App
  const app = new Fleur({ stores: [TestStore] })

  it('Should passed non connected props', () => {
    const context = app.createContext()
    const { root, unmount } = create(
      createElementWithContext(context, Connected, {
        anotherProp: 'anotherProp',
      }),
    )

    expect(root.findByType(Connected).props).toEqual(
      expect.objectContaining({
        anotherProp: 'anotherProp',
      }),
    )

    unmount()
  })

  it('Should map stores to props', async () => {
    const context = app.createContext()
    const { root, unmount } = create(
      createElementWithContext(context, Connected),
    )

    expect(root.findByType(Receiver).props).toEqual({ count: 10 })

    await context.executeOperation(op, {})
    await new Promise(r => requestAnimationFrame(r))
    expect(root.findByType(Receiver).props).toEqual({ count: 20 })
    unmount()
  })

  it('Should unlisten on component unmounted', async () => {
    const context = app.createContext()
    const wrapper = create(createElementWithContext(context, Connected))
    await new Promise(r => requestAnimationFrame(r))

    expect(context.getStore(TestStore).listeners['onChange']).toHaveLength(1)
    wrapper.unmount()
    await new Promise(r => requestAnimationFrame(r))
    expect(context.getStore(TestStore).listeners['onChange']).toHaveLength(0)
  })
})
