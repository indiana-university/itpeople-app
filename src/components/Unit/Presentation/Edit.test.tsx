import * as React from 'react'
import { render, Examples } from "src/testUtils"
import { defaultState, Permissions } from 'src/components/types'

import { Edit } from './Edit'
import * as unit from "../store";
import { initialState } from 'src/components/Unit';

interface IProps extends unit.IState {
    cancel: typeof unit.cancel;
    id: number;
    deleteUnit: typeof unit.deleteUnit
}

describe('Unit', () => {
    describe('deleting a unit', () => {
        const deleteUnitText = /delete this unit/i

        const testState: IProps = {
            ...initialState,
            id: Examples.unit.id,
            profile: { ...defaultState(), data: Examples.unit },
            cancel: unit.cancel,
            deleteUnit: unit.deleteUnit
        }

        test('without permission cannot delete', () => {
            const state = testState
            const { queryByText } = render(
                <Edit
                    {...state} />
            )
            expect(queryByText(deleteUnitText)).not.toBeInTheDocument()
        })
        test('with permission can delete', () => {
            const state = {
                ...testState,
                profile: {
                    ...testState.profile,
                    permissions: [Permissions.Delete]
                }
            }
            const { getByText } = render(
                <Edit
                    {...state} />
            )
            expect(getByText(deleteUnitText)).toBeInTheDocument()
        })
    })
})
