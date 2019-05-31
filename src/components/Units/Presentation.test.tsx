/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from 'react'
import { render } from "src/testUtils"
import { defaultState, Permissions } from 'src/components/types'

import Presentation from './Presentation'

describe('Units', () => {
    describe('adding a unit', () => {
        const addUnitText = /add new unit/i

        test('with POST permission can add', () => {
            const props = {
                units: { ...defaultState(), permissions: [Permissions.Post] },
                memberships: defaultState()
            }
            const { getByText } = render(
                <Presentation
                    {...props} />
            )
            expect(getByText(addUnitText)).toBeInTheDocument()
        })
        test('without POST permission cannot add', () => {
            const props = {
                units: { ...defaultState(), permissions: [] },
                memberships: defaultState()
            }

            const { queryByText } = render(
                <Presentation
                    {...props} />
            )
            expect(queryByText(addUnitText)).not.toBeInTheDocument()
        })
    })
})