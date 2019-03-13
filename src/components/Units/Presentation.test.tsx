import * as React from 'react'
import { render } from "src/testUtils"
import { defaultState, Permissions } from 'src/components/types'

import Presentation from './Presentation'

describe('Units', () => {
    describe('adding unit', () => {
        test('admins can', () => {
            const state = { ...defaultState(), permissions: [Permissions.Post] }
            const { getByText } = render(
                <Presentation
                    {...state} />
            )
            expect(getByText('Add new unit')).toBeInTheDocument()
        })
        test('non-admins cannot', () => {
            const state = { ...defaultState(), permissions: [] }
            const { queryByText } = render(
                <Presentation
                    {...state} />
            )
            expect(queryByText('Add new unit')).not.toBeInTheDocument()
        })
    })
})