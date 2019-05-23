# 🌼 fleur-react ⚛️ [![npm version](https://badge.fury.io/js/%40fleur%2Ffleur-react.svg)](https://www.npmjs.com/package/@fleur/fleur-react) [![travis](https://travis-ci.org/ra-gg/fleur.svg?branch=master)](https://travis-ci.org/ra-gg/fleur)

`@fleur/fleur` connector for React.
(See [`@fleur/fleur`](https://www.npmjs.com/package/@fleur/fleur) for basic usage.)

## Example

Hooks style:

```tsx
// ./components/AppRoot.tsx
import React, { useCallback } from 'react'
import { useFleurContext, useStore } from '@fleur/fleur-react'
import { increaseOp } from './operations'

export const AppRoot = props => {
  const context = useFleurContext()

  const { count } = useStore([CountStore], getStore => ({
    count: getStore(CountStore).getCount(),
  }))

  const handleCountClick = useCallback(() => {
    context.executeOperation(increaseOp)
  }, [])

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
  withFleurContext,
} from '@fleur/fleur-react'
import { increaseOp } from './operations'
import CountStore from './stores/CountStore'

export default withFleurContext(
  // pick Props from Store with `connectToStores()`
  connectToStores([CountStore], getStore => ({
    count: getStore(CountStore).getCount(),
  }))(
    class AppRoot extends React.PureComponent {
      private handleCountClick = () => {
        // ** `this.props.{executeOperation, getStore}` provide by `withFleurContext()`
        this.props.executeOperation(increaseOp)
      }

      render() {
        return <div onClick={this.handleCountClick}>{this.props.count}</div>
      }
    },
  ),
)
```

```tsx
import Fleur, { Store, listen, operation, action } from '@fleur/fleur'
import { createElementWithContext, FleurContext } from '@fleur/fleur-react'
import AppRoot from './components/AppRoot'
import CountStore from './stores/CountStore'

const app = new Fleur({ stores: [ CountStore ] })

const context = app.createContext()
ReactDOM.render(<FleurContext value={context}><AppRoot /></FluerContext>, {})
```
