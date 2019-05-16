/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as React from 'react'
import { render } from 'src/testUtils'
import App from './App'
import { create } from 'react-test-renderer'
import configureStore from 'src/configureStore'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import { ConnectedRouter } from 'connected-react-router';
import { Page } from './components/layout';

it('renders the home page at /', () => {
    const { getByTestId } = render(
        <App />,
        { route: '/' })
    expect(getByTestId('home-page')).toBeInTheDocument()
})

it('renders the signin page at "/signin"', () => {
    const { getByTestId } = render(
        <App />,
        { route: '/signin' })
    expect(getByTestId('signin-page')).toBeInTheDocument()
})

it('renders a profile page at "/people/:id"', () => {
    const { getByTestId } = render(
        <App />,
        { route: '/people/1' })
    expect(getByTestId("profile-page")).toBeInTheDocument()
})

it('renders a profile page at "/me"', () => {
    const { getByTestId } = render(
        <App />,
        { route: '/me' })
    expect(getByTestId("profile-page")).toBeInTheDocument()
})

it('renders a profile page at "/me"', () => {
    const { getByTestId } = render(
        <App />,
        { route: '/me' })
    expect(getByTestId("profile-page")).toBeInTheDocument()
})

import * as Rivet from 'rivet-react/build/dist/components/util/Rivet'
it('renders Page with uits-rivet style', () => {
    //mock Rivet's shortuid to lock it for testing
    // @ts-ignore
    Rivet.shortuid = jest.fn( () => 'id_TESTING')
    
    const history = createMemoryHistory({})
    const rendered = create(
        <Provider store={configureStore(history)}>
            <ConnectedRouter history={history}>
                <Page />
            </ConnectedRouter>
        </Provider>)
    expect(rendered).toMatchSnapshot()
})
