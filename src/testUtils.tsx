import * as React from 'react'
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import { render as rtlRender } from 'react-testing-library'
import configureStore from 'src/configureStore'
import { GlobalWithFetchMock } from "jest-fetch-mock"

// expressive expectation methods for dom queries
import 'jest-dom/extend-expect'
// unmount all components after each test
import 'react-testing-library/cleanup-after-each'

// provide jest-fetch-mock as a global drop-in replacement for fetch
const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock
customGlobal.fetch = require('jest-fetch-mock')
customGlobal.fetchMock = customGlobal.fetch

export function render(ui: any, options = { route:'' }) {
    const history = createMemoryHistory({ initialEntries: [options.route] })
    const store = configureStore(history)
    return rtlRender(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                {ui}
            </ConnectedRouter>
        </Provider>
    )
}
