import Fleur, { action, listen, operation, Store } from '@ragg/fleur'
import { create } from 'react-test-renderer'
import * as React from 'react'

import { useStore } from './useStore'
import { createElementWithContext } from './createElementWithContext'

describe('useStore', () => {
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
  const Component = (props: { anotherProp: string }) => {
    const { count } = useStore([TestStore], getStore => ({
      count: getStore(TestStore).count,
    }))

    return `${count}`
  }

  // App
  const app = new Fleur({ stores: [TestStore] })

  it('Should passed non connected props', () => {
    const context = app.createContext()
    const renderer = create(
      createElementWithContext(context, Component, {
        anotherProp: 'anotherProp',
      }),
    )

    expect(renderer.root.props).toEqual(
      expect.objectContaining({
        anotherProp: 'anotherProp',
      }),
    )

    renderer.unmount()
  })

  it('Should map stores to props', async () => {
    const context = app.createContext()
    const element = createElementWithContext(context, Component)
    const renderer = create(element)

    expect(renderer.root.children).toMatchObject(['10'])
    await context.executeOperation(op, {})
    await new Promise(r => requestAnimationFrame(r))
    expect(renderer.root.children).toMatchObject(['20'])
    renderer.unmount()
  })

  it('Should unlisten on component unmounted', async () => {
    const context = app.createContext()
    const renderer = create(createElementWithContext(context, Component))
    await new Promise(r => requestAnimationFrame(r))

    expect(context.getStore(TestStore).listeners.onChange).toHaveLength(1)
    renderer.unmount()
    expect(context.getStore(TestStore).listeners.onChange).toHaveLength(0)
  })
})
