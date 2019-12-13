import Fleur from '@fleur/fleur'
import { create } from 'react-test-renderer'
import * as React from 'react'

import { createElementWithContext } from './createElementWithContext'
import { withFleurContext, ContextProp } from './withFleurContext'

describe('withFleurContext', () => {
  it('Is received context in props', async () => {
    const app = new Fleur()
    const context = app.createContext()

    const Receiver = (arg: { prop: string } & ContextProp) => <div />
    const Wrapped = withFleurContext(Receiver)

    const { root, unmount } = create(
      createElementWithContext(context, Wrapped, { prop: 'prop string' }),
    )

    expect(root.findByType(Receiver).props).toEqual({
      depend: context.componentContext.depend,
      executeOperation: context.componentContext.executeOperation,
      getStore: context.componentContext.getStore,
      prop: 'prop string',
    })

    unmount()
  })
})
