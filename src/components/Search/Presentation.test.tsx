/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as React from 'react'
import { IApiState, defaultState, IPerson, IUnit, IDepartment, IEntity, IEntityRequest, IBuilding } from 'src/components/types'
import * as examples from 'src/db.json'
import { render } from "src/testUtils"

import { Results, SearchLists } from './Results'

describe('Results by list', () => {
    const examplePerson: IPerson = { ...examples.people[0] }
    const exampleUnit: IUnit = {...examples.units[0] } as IUnit;
    const exampleBldg: IBuilding = { ...examples.buildings[0] }
    const exampleDept: IDepartment = {...examples.departments[0] }
    
    const peopleResults: IApiState<IEntityRequest, IEntity[]> = { ...defaultState(), data: [examplePerson] }
    const deptsResults: IApiState<IEntityRequest, IDepartment[]> = { ...defaultState(), data: [exampleDept] }
    const buildingsResults: IApiState<IEntityRequest, IBuilding[]> = { ...defaultState(), data: [exampleBldg] }
    const unitsResults: IApiState<IEntityRequest, IUnit[]> = { ...defaultState(), data: [exampleUnit] }
    const setCurrentList = (list: SearchLists) => { }

    test('for people', () => {
        const { getByText } = render(
            <Results
                people={peopleResults}
                departments={defaultState()}
                buildings={defaultState()}
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
                buildings={defaultState()}
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
                buildings={defaultState()}
                units={defaultState()}
                selectedList={SearchLists.Departments}
                setCurrentList={setCurrentList}
            />
        )

        expect(getByText(exampleDept.name)).toBeInTheDocument()
    })

    test('for departments', () => {
        const { getByText } = render(
            <Results
                people={defaultState()}
                departments={defaultState()}
                buildings={buildingsResults}
                units={defaultState()}
                selectedList={SearchLists.Buildings}
                setCurrentList={setCurrentList}
            />
        )

        expect(getByText(exampleBldg.name)).toBeInTheDocument()
    })
})