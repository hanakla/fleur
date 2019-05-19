import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './components/App'
import { app } from './app'
import { FleurContext } from '@ragg/fleur-react'
import { RouterProvider, restoreNavigateOp } from '@ragg/fleur-route-store-dom'
import { withReduxDevTools } from '@ragg/fleur'

document.addEventListener('DOMContentLoaded', async () => {
  const state = (window as any).__rehydratedState
  const context = app.createContext()
  withReduxDevTools(context)
  ;(window as any).context = context

  context.rehydrate(state)
  await context.executeOperation(restoreNavigateOp)

  ReactDOM.hydrate(
    <FleurContext value={context}>
      <RouterProvider>
        <App />
      </RouterProvider>
    </FleurContext>,
    document.querySelector('.todoapp'),
  )
})
