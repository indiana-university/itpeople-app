/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as React from 'react'
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import { render as rtlRender } from 'react-testing-library'
import { View } from './View'
import { initialState, toggleUnit } from "../store";
import configureStore from 'src/configureStore'
import { defaultState, IPerson, IUnitMembership, IUnit } from 'src/components/types'
import * as examples from 'src/db.json'
import { GlobalWithFetchMock } from "jest-fetch-mock"

import 'jest-dom/extend-expect'
import 'react-testing-library/cleanup-after-each'

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock
customGlobal.fetch = require('jest-fetch-mock')
customGlobal.fetchMock = customGlobal.fetch

function render(ui: any, { route = '' }) {
    const history = createMemoryHistory({ initialEntries: [route] })
    const store = configureStore(history)
    return rtlRender(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                {ui}
            </ConnectedRouter>
        </Provider>
    )
}

test('displays the name of the person', () => {
    const person1: IPerson = examples.people[0]
    const person1State = { ...defaultState(), data: person1 }
    const route = '/person/1'

    const { getByText } = render(
        <View {...initialState}
            toggleUnit={toggleUnit}
            person={person1State} />,
        { route: route }
    )

    expect(getByText(person1.name)).toBeInTheDocument()
})

test('shows a loading message while loading person', () => {
    const person1: IPerson = examples.people[0]
    const person1State = { ...defaultState(), data: person1, loading: true }
    const route = '/person/1'
    const { getByLabelText } = render(
        <View {...initialState}
            toggleUnit={toggleUnit}
            person={person1State} />,
        { route: route }
    )

    expect(getByLabelText("Content loading")).toBeInTheDocument()
})

test('displays unit name for unit memberships for that person', () => {
    const person1: IPerson = examples.people[0]
    const p1Memb1Unit: IUnit = examples.units[0]
    const p1Memberships: Array<IUnitMembership> = [{ ...examples.memberships[0], unit: p1Memb1Unit }]
    const person1State = { ...defaultState(), data: person1 }
    const p1MembershipsState = { ...defaultState(), data: p1Memberships }

    const route = '/person/1'
    const { getByText } = render(
        <View {...initialState}
            toggleUnit={toggleUnit}
            person={person1State}
            memberships={p1MembershipsState} />,
        { route: route }
    )

    expect(getByText(p1Memb1Unit.name)).toBeInTheDocument()
})

