import Fleur, { action, operations, reducerStore } from '@fleur/fleur'
import { useFleurContext } from '@fleur/react'
import { FleurContext, useStore } from '@fleur/react'
import { useCallback } from 'react'
import { render } from 'react-dom'

const appActions = {
  fetchCount: action.async<void, { count: number }>(),
  increment: action<{ amount: number }>(),
  decrement: action<{ amount: number }>(),
}

const AppStore = reducerStore('App', () => ({ count: 0 }))
  .listen(
    appActions.fetchCount.done,
    (draft, { count }) => (draft.count = count),
  )
  .listen(appActions.increment, (draft, { amount }) => {
    draft.count += amount
  })
  .listen(appActions.decrement, (draft, { amount }) => {
    draft.count -= amount
  })

const AppOps = operations({
  fetchCount: async (context, { userId }: { userId: number }) => {
    context.dispatch(appActions.fetchCount.done, { count: 1 })
  },
  increment: (context, { amount }: { amount: number }) => {
    context.dispatch(appActions.increment, { amount })
  },
  decrement: (context, { amount }: { amount: number }) => {
    context.dispatch(appActions.decrement, { amount })
  },
})

const app = new Fleur({ stores: [AppStore] })
const context = app.createContext()

;(async () => {
  await context.executeOperation(AppOps.fetchCount, { userId: 1 })
  await context.executeOperation(AppOps.increment, { amount: 10 })

  console.log("It's Fleur")
  console.log('Assert', context.getStore(AppStore).state.count === 11)
})()

const App = () => {
  const { executeOperation } = useFleurContext()
  const count = useStore((get) => get(AppStore).state.count)
  const handleClick = useCallback(() => {
    executeOperation(AppOps.increment, { amount: 1 })
  }, [])

  return <button onClick={handleClick}>{count}</button>
}

document.addEventListener('DOMContentLoaded', () => {
  render(
    <FleurContext value={context}>
      <App />
    </FleurContext>,
    document.getElementById('root'),
  )
})
