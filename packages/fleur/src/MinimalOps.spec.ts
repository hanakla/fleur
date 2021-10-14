import { Fleur } from './Fleur'
import { minOps } from './MinimalOps'

describe('MinimalOps', () => {
  const [TestStore, testOps] = minOps('Test', {
    ops: {
      setText: ({ state }, text: string) => {
        state.text = text
      },
    },
    initialState: () => ({
      text: 'hi',
    }),
  })

  const app = new Fleur({ stores: [TestStore] })

  it('', async () => {
    const ctx = app.createContext()
    await ctx.executeOperation(testOps.setText, 'next')
    await ctx.executeOperation(testOps.setText.abort)
    expect(ctx.getStore(TestStore).state).toMatchObject({ text: 'next' })
  })
})
