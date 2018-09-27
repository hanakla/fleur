import * as React from 'react'
import { withComponentContext, ContextProp } from '@ragg/fleur-react'
import { createBrowserHistory, History, LocationListener } from 'history'
import { navigateOperation } from '@ragg/fleur-route-store/src/navigateOperation';

export const HistoryHandler = withComponentContext(class HistoryHandler extends React.Component<ContextProp> {
    private history: History

    public componentDidMount() {
        this.history = createBrowserHistory({})
        this.history.listen(this.handleChangeLocation)
    }


    private handleChangeLocation: LocationListener = (location) => {
        this.props.context.executeOperation(navigateOperation, {
            url: location.pathname,
        })
    }

    public render() {
        return null
    }
})
