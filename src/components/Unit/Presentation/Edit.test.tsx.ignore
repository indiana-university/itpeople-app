/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from 'react'
import { render, Examples } from "src/testUtils"
import { fireEvent } from "react-testing-library"
import { defaultState, Permissions } from 'src/components/types'

import { IProps, Edit } from './Edit'
import * as unit from "../store"
import { IDispatchProps } from "../Container"
import { initialState } from 'src/components/Unit';

// bypass confirmation
declare let global: any
global.confirm = jest.fn(() => true)

describe('Unit', () => {

    const testState: unit.IState = {
        ...initialState,
        profile: {
            ...defaultState(),
            data: Examples.unit
        },
        members: {
            ...defaultState(),
            data: [Examples.member]
        }
    }

    const testProps: IProps = {
        ...testState,
        id: Examples.unit.id,
        cancel: jest.fn(),
        deleteUnit: jest.fn()
    }

    const testDispatchProps: IDispatchProps = {
        fetchUnit: jest.fn(),
        edit: jest.fn(),
        save: jest.fn(),
        cancel: jest.fn(),
        deleteUnit: jest.fn()
    }

    describe('deleting', () => {
        const deleteUnitText = /delete this unit/i

        it('cannot delete without permission', () => {
            const props = { ...testDispatchProps, ...testProps, ...testState }
            const { queryByText } = render(
                <Edit
                    {...props} />
            )
            expect(queryByText(deleteUnitText)).not.toBeInTheDocument()
        })
        it('can delete with permission', async () => {
            const stateWithDeletePermissions = {
                ...testState,
                profile: {
                    ...testState.profile,
                    permissions: [Permissions.Delete]
                }
            }
            const props = { ...testDispatchProps, ...testProps, ...stateWithDeletePermissions }

            const { getByText } = render(
                <Edit
                    {...props} />
            )
            expect(getByText(deleteUnitText)).toBeInTheDocument()
            fireEvent.click(getByText(deleteUnitText))
            expect(window.confirm).toBeCalled()
        })
    })
})
