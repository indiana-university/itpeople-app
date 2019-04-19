/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from 'react'
import { render, Examples } from 'src/testUtils'
import { View } from './View'
import { initialState, toggleUnit } from "../store";
import { defaultState } from 'src/components/types'

const testState = {
    ...initialState,
    person: {
        ...defaultState(),
        data: Examples.person
    },
    toggleUnit: toggleUnit
}

test('displays the name of the person', () => {

    const { getByText } = render(
        <View {...testState}
        />
    )

    expect(getByText(Examples.person.name)).toBeInTheDocument()
})

test('shows a loading message while loading', () => {
    const loadingState = {
        ...testState,
        person: {
            ...testState.person,
            loading: true
        }
    }

    const { getByLabelText } = render(
        <View {...loadingState} />
    )

    expect(getByLabelText(/content loading/i)).toBeInTheDocument()
})

<<<<<<< HEAD
// test('displays unit name for unit memberships for that person', () => {
//     const p1Unit: IUnit = {...examples.units[0] }
//     const p1Memberships: Array<IUnitMembership> = [{ ...examples.memberships[0], unit: p1Unit }]

//     const { getByText } = render(
//         <View {...initialState}
//             toggleUnit={toggleUnit}
//             person={{ ...defaultState(), data: person1 }}
//             memberships={{ ...defaultState(), data: p1Memberships }} />,
//         { route: '/person/1' }
//     )

//     expect(getByText(p1Unit.name)).toBeInTheDocument()
// })
=======
test('displays unit name person is member of', () => {
    const memberState = {
        ...testState,
        memberships: {
            ...defaultState(),
            data:
                [{
                    ...Examples.member,
                    unit: { ...Examples.unit }
                }]
        }
    }
    const { getByText } = render(
        <View {...memberState}
        />
    )

    expect(getByText(Examples.unit.name)).toBeInTheDocument()
})
>>>>>>> develop

