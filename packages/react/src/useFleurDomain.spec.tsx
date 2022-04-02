import React from 'react'
import Fleur, { AppContext, minOps } from '@fleur/fleur'
import { renderHook } from '@testing-library/react-hooks'
import { FleurContext } from './ComponentReactContext'
import { useFleurDomain } from './useFleurDomain'

describe('useFleurDomain', () => {
  // App
  const [TestStore, testOps] = minOps('Test', {
    ops: {
      a(x, value: string) {
        x.commit({ check: true, value })
      },
      b() {},
    },
    initialState: () => ({ check: false, value: '' }),
  })

  const app = new Fleur({ stores: [TestStore] })

  const wrapperFactory = (context: AppContext) => {
    return ({ children }: { children: React.ReactNode }) => (
      <FleurContext value={context}>{children}</FleurContext>
    )
  }

  it('Should work', async () => {
    const context = app.createContext()
    const { result, waitForNextUpdate, unmount } = renderHook(
      () => useFleurDomain(TestStore, testOps),
      {
        wrapper: wrapperFactory(context),
      },
    )

    expect(result.current[1].a).toBeInstanceOf(Function)
    expect(result.current[1].b).toBeInstanceOf(Function)
    expect(result.current[0]).toMatchObject({
      check: false,
      value: '',
    })

    result.current[1].a('hello')
    await waitForNextUpdate()

    expect(result.current[0]).toMatchObject(context.getStore(TestStore).state)

    unmount()
  })
})
