import * as React from 'react'
import { IApiState, defaultState, IPerson, IUnit, IDepartment } from 'src/components/types'
import * as examples from 'src/db.json'
import { render } from "src/testUtils"

import { Results, SearchLists } from './Results'

describe('Results by list', () => {
    const examplePerson: IPerson = examples.people[0]
    const exampleUnit: IUnit = examples.units[0]
    const exampleDept: IDepartment = examples.departments[0]
    const peeps: IApiState<null, IPerson[]> = { ...defaultState(), data: [examplePerson] }
    const depts: IApiState<null, IDepartment[]> = { ...defaultState(), data: [exampleDept] }
    const units: IApiState<null, IUnit[]> = { ...defaultState(), data: [exampleUnit] }
    const setCurrentList = (list: SearchLists) => { }
  
    test('for people', () => {
        const { getByText } = render(
            <Results
                people={peeps}
                departments={defaultState()}
                units={defaultState()}
                selectedList={SearchLists.People}
                setCurrentList={setCurrentList}
            />
        )

        expect(getByText(examplePerson.name)).toBeInTheDocument()
    })

    test('for units', () => {
        const { getByText } = render(
            <Results
                people={defaultState()}
                departments={defaultState()}
                units={units}
                selectedList={SearchLists.Units}
                setCurrentList={setCurrentList}
            />
        )

        expect(getByText(exampleUnit.name)).toBeInTheDocument()
    })

    test('for departments', () => {
        const { getByText } = render(
            <Results
                people={defaultState()}
                departments={depts}
                units={defaultState()}
                selectedList={SearchLists.Departments}
                setCurrentList={setCurrentList}
            />
        )

        expect(getByText(exampleDept.name)).toBeInTheDocument()
    })
})