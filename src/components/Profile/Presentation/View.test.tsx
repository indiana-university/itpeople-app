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
import { defaultState, IPerson } from 'src/components/types'
import * as examples from 'src/db.json'
import { GlobalWithFetchMock } from "jest-fetch-mock"

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock
customGlobal.fetch = require('jest-fetch-mock')
customGlobal.fetchMock = customGlobal.fetch

it('shows the name of the person', () => {
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

