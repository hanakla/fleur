import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import { App } from './components/App'
import { app } from './app'
import { FleurContext } from '@ragg/fleur-react'
import { RouterContext, navigateOp } from '@ragg/fleur-route-store-dom'

document.addEventListener('DOMContentLoaded', async () => {
  const state = (window as any).__rehydratedState
  const context = app.createContext()
  ;(window as any).context = context

  context.rehydrate(state)
  await context.executeOperation(navigateOp, { url: location.pathname })

  ReactDOM.hydrate(
    <FleurContext value={context}>
      <RouterContext>
        <App />
      </RouterContext>
    </FleurContext>,
    document.querySelector('.todoapp'),
  )
})
