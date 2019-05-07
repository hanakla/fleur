# 🌼 fleur-react ⚛️ [![npm version](https://badge.fury.io/js/%40ragg%2Ffleur-react.svg)](https://www.npmjs.com/package/@ragg/fleur-react) [![travis](https://travis-ci.org/ra-gg/fleur.svg?branch=master)](https://travis-ci.org/ra-gg/fleur)

`@ragg/fleur` connector for React.
(See [`@ragg/fleur`](https://www.npmjs.com/package/@ragg/fleur) for basic usage.)

## Example

Hooks style:

```tsx
// ./components/AppRoot.tsx
import React, { useCallback } from 'react'
import { useComponentContext, useStore } from '@ragg/fleur-react'
import { increaseOp } from './operations'

export const AppRoot = props => {
  const context = useComponentContext()

  const { count } = useStore([CountStore], getStore => ({
    count: getStore(CountStore).getCount(),
  }))

  const handleCountClick = useCallback(() => {
    context.executeOperation(increaseOp)
  })

  return <div onClick={handleCountClick}>{count}</div>
}
```

Class style:

```tsx
// ./components/AppRoot.tsx

import React from 'react'

import {
  createElementWithContext,
  connectToStores,
  withComponentContext,
} from '@ragg/fleur-react'
import { increaseOp } from './operations'
import CountStore from './stores/CountStore'

export default withComponentContext(
  // pick Props from Store with `connectToStores()`
  connectToStores([CountStore], getStore => ({
    count: getStore(CountStore).getCount(),
  }))(
    class AppRoot extends React.PureComponent {
      private handleCountClick = () => {
        // ** `this.props.context: Fleur.ComponentContext` provide by `withComponentContext()`
        this.props.context.executeOperation(increaseOp)
      }

      render() {
        return <div onClick={this.handleCountClick}>{this.props.count}</div>
      }
    },
  ),
)
```

```tsx
import Fleur, { Store, listen, operation, action } from '@ragg/fleur'
import { createElementWithContext, FleurContext } from '@ragg/fleur-react'
import AppRoot from './components/AppRoot'
import CountStore from './stores/CountStore'

const app = new Fleur({ stores: [ CountStore ] })

const context = app.createContext()
ReactDOM.render(<FleurContext value={context}><AppRoot /></FluerContext>, {})
```
