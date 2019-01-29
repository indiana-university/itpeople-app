/**
 * @jest-environment node
 */

/**
* Copyright (C) 2018 The Trustees of Indiana University
* SPDX-License-Identifier: BSD-3-Clause
*/

import * as path from 'path'
import { expectSaga } from 'redux-saga-test-plan'
import { Reducer } from 'redux';
import { Effect } from 'redux-saga';
import { UnitActionTypes, saga as unitSaga, handleSaveUnit, handleSaveMember, IUnitMember, UnitPermissions, IUnitMemberRequest } from './store'
import { apiFn, apiEndpoints as apiResources } from '../effects';


const sagaApiHappyPath = async (saga: any, state: any, expectedMethod: string, expectedPath: string, expectedData: any, expectedDispatch: string) => {
    const api: apiFn = (m, u, p, d, h) => {
        expect(m).toEqual(expectedMethod);
        expect(p).toEqual(expectedPath);
        expect(d).toEqual(expectedData);
        return Promise.resolve({});
    }
    await expectSaga(saga, api)
      .withState(state)
      .put({ type: expectedDispatch, payload: {}, meta: undefined })
      .silentRun(50);
}

const sagaApiSadPath = async (saga: any, state: any, expectedDispatch: string) => {
    const api: apiFn = (m, u, p, d, h) =>
        Promise.resolve({ errors: ["Error"] });
    await expectSaga(saga, api)
        .withState(state)
        .put({ type: expectedDispatch, payload: ["Error"], meta: undefined })
        .silentRun(50);
};

describe('unit memberships', () => {

    const member: IUnitMemberRequest = { 
        unitId: 1, 
        memberId: 2, 
        personId: 3, 
        title: "Mr Manager", 
        role: "Leader", 
        permissions: UnitPermissions.Viewer, 
        percentage: 100 
    };

    describe ('creating', () => {
        const path = apiResources.units.members(member.unitId);
        const state = { form: { addMemberForm: { values: {...member, memberId: undefined } } } };
        it("happy path", async () => {
            await sagaApiHappyPath(handleSaveMember, state, "post", path, member, UnitActionTypes.UNIT_SAVE_MEMBER_SUCCESS)
        });
        it("sad path", async () =>
            await sagaApiSadPath(handleSaveMember, state, UnitActionTypes.UNIT_SAVE_MEMBER_ERROR)
        );
    });

    describe('updating', () => {
        const path = apiResources.units.members(member.unitId, member.memberId);
        const state = { form: { addMemberForm: { values: member } } };
        it("happy path", async () => {
            await sagaApiHappyPath(handleSaveMember, state, "put", path, member, UnitActionTypes.UNIT_SAVE_MEMBER_SUCCESS)
        });
        it("sad path", async () =>
            await sagaApiSadPath(handleSaveMember, state, UnitActionTypes.UNIT_SAVE_MEMBER_ERROR)
        );
    });
    
});