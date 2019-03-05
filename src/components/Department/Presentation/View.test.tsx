/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as React from 'react'
import { render } from 'src/testUtils'
import { View } from './View'
import { initialState } from "../store";
import { defaultState, IDepartment } from 'src/components/types'
import * as examples from 'src/db.json'

const dept1: IDepartment = examples.people[0]

test('displays the name of the person', () => {
    const department1State = { ...defaultState(), data: dept1 }

    const { getByText } = render(
        <View {...initialState}
            profile={department1State} />
    )

    expect(getByText(dept1.name)).toBeInTheDocument()
})

