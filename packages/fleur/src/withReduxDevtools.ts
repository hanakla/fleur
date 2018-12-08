import AppContext from "./AppContext";

interface Option {
    enableTimeTravel?: boolean
}

type DevToolsAction = {
    type: string;
    payload: {
        type: 'JUMP_TO_ACTION' | 'TOGGLE_ACTION'
    };
    state: string;
}

export const withReduxDevTools = <T extends AppContext<any>>(context: T, { enableTimeTravel = true }: Option = {}): T => {
    if (!(window as any).__REDUX_DEVTOOLS_EXTENSION__) return context

    const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect()
    devTools.subscribe(({type, payload, state}: DevToolsAction) => {
        if (type !== 'DISPATCH') return

        if (!enableTimeTravel) {
            console.log('[fleur-redux-devtools] Time traveling is disabled')
            return
        }

        if (payload.type === 'TOGGLE_ACTION') {
            console.log('[fleur-redux-devtools] Skip action doesn\'t supported.')
            return
        }

        const stores = JSON.parse(state)
        context.rehydrate({ stores })
        context.stores.forEach(store => store.emitChange())
    })

    const dispatch = context.dispatch.bind(context)
    context.dispatch = (actionIdentifier: any, payload: any) => {
        dispatch(actionIdentifier, payload)
        devTools.send({ type: actionIdentifier.name, payload }, context.dehydrate().stores)
    }

    return context
}
