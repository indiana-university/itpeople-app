import * as React from 'react'
import { Examples } from 'src/testUtils'
import { render } from 'react-testing-library'
// import { fireEvent } from 'react-testing-library'
import { defaultState } from 'src/components/types'

import { form as UpdateMemberToolsForm } from './UpdateMemberToolsForm'
import * as unit from "../store";
import { initialState } from 'src/components/Unit';

// bypass confirmation
declare let global: any
global.confirm = jest.fn(() => true)

describe('Unit members', () => {

    const testState = {
        ...initialState,
        id: Examples.unit.id,
        profile: {
            ...defaultState(),
            data: Examples.unit
        },
        cancel: unit.cancel,
        deleteUnit: unit.deleteUnit
    }

    describe('editing tools', () => {
        it('adding tools for a member', () => {
            const state = {
                // ...testState,
                tools: Examples.tools
            }
            const { getByText } = render(
                <UpdateMemberToolsForm
                    {...state} />
            )
            console.log(state)
            expect(getByText(`${Examples.tool.name}`)).toBeInTheDocument()
        })
    })
})
