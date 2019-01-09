# 🌼 fleur-react ⚛️ [![npm version](https://badge.fury.io/js/%40ragg%2Ffleur-react.svg)](https://www.npmjs.com/package/@ragg/fleur-react) [![travis](https://travis-ci.org/ra-gg/fleur.svg?branch=master)](https://travis-ci.org/ra-gg/fleur)
`@ragg/fleur` connector for React.
(See [`@ragg/fleur`](https://www.npmjs.com/package/@ragg/fleur) for basic usage.)

## Example
``` tsx
// ./components/AppRoot.tsx

import React from 'react'

import { createElementWithContext, connectToStores, withComponentContext } from '@ragg/fleur-react'
import { increaseOperation } from './operations'
import SomeStore from './stores/SomeStore'

export default withComponentContext(
    // pick Props from Store with `connectToStores()`
    connectToStores([CountStore], getStore => ({
        count: getStore(CountStore).getCount()
    })
)(class App extends React.PureComponent {
    private handleCountClick = () => {
        // ** `this.props.context: Fleur.ComponentContext` provide by `withComponentContext()`
        this.props.context.executeOperation(increaseOperation)
    }

    render() {
        return (
            <div onClick={this.handleCountClick}>
                {this.props.count}
            </div>
        )
    }
}))
```

``` typescript
import Fleur, { Store, listen, operation, action } from '@ragg/fleur'
import { createElementWithContext } from '@ragg/fleur-react'
import AppRoot from './components/AppRoot'
import SomeStore from './stores/SomeStore'

const app = new Fleur({ stores: [ SomeStore ] })

const context = app.createContext()
ReactDOM.render(createElementWithContext(context, App, {})
```
