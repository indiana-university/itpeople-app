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

import {GlobalWithFetchMock} from "jest-fetch-mock"
 
const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock
customGlobal.fetch = require('jest-fetch-mock')
customGlobal.fetchMock = customGlobal.fetch

const renderAppOn = (location: string) => {
    const history = createMemoryHistory({ initialEntries: [location] })
    const store = configureStore(history)
    const utils = render(
        <Provider store={store}>
            <Router history={history}>
                <App />
            </Router>
        </Provider>)
    return { ...utils }
}

it('renders the home page at /', () => {
    const { getByTestId } = renderAppOn('/')
    expect(getByTestId('home-page')).toBeInTheDocument()
})

it('renders the signin page at "/signin"', () => {
    const { getByTestId } = renderAppOn('/signin')
    expect(getByTestId('signin-page')).toBeInTheDocument()
})

it('renders a profile page at "/people/:id"', () => {
    const { getByTestId } = renderAppOn('/people/1')
    expect(getByTestId("profile-page")).toBeInTheDocument()
})

it('renders a profile page at "/me"', () => {
    const { getByTestId } = renderAppOn('/me')
    expect(getByTestId("profile-page")).toBeInTheDocument()
})

it('renders a profile page at "/me"', () => {
    const { getByTestId } = renderAppOn('/me')
    expect(getByTestId("profile-page")).toBeInTheDocument()
})
