/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as React from 'react'
import { render } from 'src/testUtils'
import { View } from './View'
import { initialState, toggleUnit } from "../store";
import { defaultState, IPerson, IUnitMembership, IUnit } from 'src/components/types'
import * as examples from 'src/db.json'

const person1: IPerson = { ...examples.people[0] }

test('displays the name of the person', () => {
    const person1State = { ...defaultState(), data: person1 }

    const { getByText } = render(
        <View {...initialState}
            toggleUnit={toggleUnit}
            person={person1State} />,
        { route: '/person/1' }
    )

    expect(getByText(person1.name)).toBeInTheDocument()
})

test('shows a loading message while loading person', () => {
    const person1State = { ...defaultState(), data: person1, loading: true }

    const { getByLabelText } = render(
        <View {...initialState}
            toggleUnit={toggleUnit}
            person={person1State} />,
        { route: '/person/1' }
    )

    expect(getByLabelText("Content loading")).toBeInTheDocument()
})

test('displays unit name for unit memberships for that person', () => {
    const p1Unit: IUnit = {...examples.units[0] }
    const p1Memberships: Array<IUnitMembership> = [{ ...examples.memberships[0], unit: p1Unit }]

    const { getByText } = render(
        <View {...initialState}
            toggleUnit={toggleUnit}
            person={{ ...defaultState(), data: person1 }}
            memberships={{ ...defaultState(), data: p1Memberships }} />,
        { route: '/person/1' }
    )

    expect(getByText(p1Unit.name)).toBeInTheDocument()
})

