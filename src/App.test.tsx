/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */
import 'jest-dom/extend-expect'
import 'react-testing-library/cleanup-after-each'

import * as React from 'react'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import { render } from 'react-testing-library'

import App from './App'
import configureStore from './configureStore'

it('renders the home page at /', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] })
    const store = configureStore(history)
    const { getByTestId } = render(
        <Provider store={store}>
            <Router history={history}>
                <App />
            </Router>
        </Provider>)
    expect(getByTestId('home-page')).toBeInTheDocument()
})
