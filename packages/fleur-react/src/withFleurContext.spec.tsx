import Fleur from '@ragg/fleur'
import { create } from 'react-test-renderer'
import * as React from 'react'

import { createElementWithContext } from './createElementWithContext'
import withComponentContext, { ContextProp } from './withComponentContext'

describe('withFleurContext', () => {
  it('Is received context in props', async () => {
    const app = new Fleur()
    const context = app.createContext()

    const Receiver = () => <div />
    const Wrapped = withComponentContext(Receiver)

    const { root, unmount } = create(
      createElementWithContext(context, Wrapped, { prop: 'prop string' }),
    )

    expect(root.findByType(Receiver).props).toEqual({
      executeOperation: context.componentContext.executeOperation,
      getStore: context.componentContext.getStore,
      prop: 'prop string',
    })

    unmount()
  })
})
