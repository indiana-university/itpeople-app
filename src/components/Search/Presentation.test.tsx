import * as React from 'react'
import { IApiState, defaultState, IPerson, IUnit, IDepartment, IEntity, IEntityRequest } from 'src/components/types'
import * as examples from 'src/db.json'
import { render } from "src/testUtils"

import { Results, SearchLists } from './Results'

describe('Results by list', () => {
    const examplePerson: IPerson = examples.people[0]
    const exampleUnit: IUnit = examples.units[0]
    const exampleDept: IDepartment = examples.departments[0]
    const peopleResults: IApiState<IEntityRequest, IEntity[]> = { ...defaultState(), data: [examplePerson] }
    const deptsResults: IApiState<IEntityRequest, IDepartment[]> = { ...defaultState(), data: [exampleDept] }
    const unitsResults: IApiState<IEntityRequest, IUnit[]> = { ...defaultState(), data: [exampleUnit] }
    const setCurrentList = (list: SearchLists) => { }
  
    test('for people', () => {
        const { getByText } = render(
            <Results
                people={peopleResults}
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
                units={unitsResults}
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
                departments={deptsResults}
                units={defaultState()}
                selectedList={SearchLists.Departments}
                setCurrentList={setCurrentList}
            />
        )

        expect(getByText(exampleDept.name)).toBeInTheDocument()
    })
})