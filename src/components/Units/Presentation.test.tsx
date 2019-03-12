import * as React from 'react'
import { render } from "src/testUtils"
import { initialState } from "./store";

import Presentation from './Presentation'

describe('Units', () => {
    test('adding a unit', () => {
        const { getByText } = render(
            <Presentation 
            {...initialState}/>
        )
        expect(getByText('blah')).toBeInTheDocument()
    })
})