# 🌼 @fleur/react ⚛️ [![npm version](https://badge.fury.io/js/%40fleur%2Freact.svg)](https://www.npmjs.com/package/@fleur/react) [![travis](https://travis-ci.org/ra-gg/fleur.svg?branch=master)](https://travis-ci.org/ra-gg/fleur) ![minifiedgzip](https://badgen.net/bundlephobia/minzip/@fleur/react)

`@fleur/fleur` connector for React.
(See [`@fleur/fleur`](https://www.npmjs.com/package/@fleur/fleur) for basic usage.)

## Example


```tsx
// bootstrap
import Fleur from '@fleur/fleur'
import { FleurContext } from '@fleur/react'
import AppRoot from './components/AppRoot'
import CountStore from './stores/CountStore'

const app = new Fleur({ stores: [ CountStore ] })

const context = app.createContext()
ReactDOM.render(<FleurContext value={context}><AppRoot /></FluerContext>, {})
```

Hooks style:

```tsx
// ./components/AppRoot.tsx
import React, { useCallback } from 'react'
import { useFleurContext, useStore } from '@fleur/react'
import { increaseOp } from './operations'

export const AppRoot = props => {
  const context = useFleurContext()

  const { count } = useStore(getStore => ({
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
} from '@fleur/react'
import { increaseOp } from './operations'
import CountStore from './stores/CountStore'

export default withFleurContext(
  // pick Props from Store with `connectToStores()`
  connectToStores(getStore => ({
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
