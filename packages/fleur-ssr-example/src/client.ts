import * as ReactDOM from 'react-dom'
import { createElementWithContext } from '@ragg/fleur-react'

import { app } from './app'
import { App } from './components/App'

window.addEventListener('DOMContentLoaded', () => {
  const context = app.createContext()
  const state = (window as any).__dehydratedState
  console.log(state)
  context.rehydrate(state)
  ReactDOM.hydrate(
    createElementWithContext(context, App),
    document.getElementById('root'),
  )
})
