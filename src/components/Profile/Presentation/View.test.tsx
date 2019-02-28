/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */
import 'jest-dom/extend-expect'
import 'react-testing-library/cleanup-after-each'

import * as React from 'react'
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import { render } from 'react-testing-library'
import { View } from './View'
import { initialState, toggleUnit } from "../store";
import configureStore from 'src/configureStore'
import { defaultState, IPerson, IUnitMembership, IUnit } from 'src/components/types'
import * as examples from 'src/db.json'
import { GlobalWithFetchMock } from "jest-fetch-mock"

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock
customGlobal.fetch = require('jest-fetch-mock')
customGlobal.fetchMock = customGlobal.fetch

it('displays the name of the person', () => {
    const history = createMemoryHistory({ initialEntries: ['/person/1'] })
    const person1: IPerson = examples.people[0]
    const person1State = { ...defaultState(), data: person1 }

    const { getByText } = render(
        <Provider store={configureStore(history)}>
            <ConnectedRouter history={history}>
                <View {...initialState}
                    toggleUnit={toggleUnit}
                    person={person1State} />
            </ConnectedRouter>
        </Provider>)

    expect(getByText(person1.name)).toBeInTheDocument()
})

it('shows a loading message while loading person', () => {
    const history = createMemoryHistory({ initialEntries: ['/person/1'] })
    const person1: IPerson = examples.people[0]
    const person1State = { ...defaultState(), data: person1, loading: true }

    const { getByLabelText } = render(
        <Provider store={configureStore(history)}>
            <ConnectedRouter history={history}>
                <View {...initialState}
                    toggleUnit={toggleUnit}
                    person={person1State} />
            </ConnectedRouter>
        </Provider>)

    expect(getByLabelText("Content loading")).toBeInTheDocument()
})

it('displays unit name for unit memberships for that person', () => {
    const history = createMemoryHistory({ initialEntries: ['/person/1'] })
    const person1: IPerson = examples.people[0]
    const p1Memb1Unit: IUnit = examples.units[0]
    const p1Memberships: Array<IUnitMembership> = [{ ...examples.memberships[0], unit: p1Memb1Unit }]
    const person1State = { ...defaultState(), data: person1 }
    const p1MembershipsState = { ...defaultState(), data: p1Memberships }

    const { getByText } = render(
        <Provider store={configureStore(history)}>
            <ConnectedRouter history={history}>
                <View {...initialState}
                    toggleUnit={toggleUnit}
                    person={person1State}
                    memberships={p1MembershipsState} />
            </ConnectedRouter>
        </Provider>)

    expect(getByText(p1Memb1Unit.name)).toBeInTheDocument()
})

