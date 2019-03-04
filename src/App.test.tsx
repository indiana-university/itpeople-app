/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as React from 'react'
import { render } from 'src/testUtils'
import App from './App'

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
