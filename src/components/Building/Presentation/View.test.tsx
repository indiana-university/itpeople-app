/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as React from 'react'
import { render, Examples } from 'src/testUtils'
import { View } from './View'
import { initialState } from "../store";
import { defaultState } from 'src/components/types'

test('displays the name of the building', () => {
    const testState = {
        ...initialState,
        profile: {
            ...defaultState(),
            data: Examples.building
        }
    }

    const { getByText } = render(
        <View {...testState} />
    )

    expect(getByText(Examples.building.name)).toBeInTheDocument()
})

