/**
 * @jest-environment node
 */

/**
* Copyright (C) 2018 The Trustees of Indiana University
* SPDX-License-Identifier: BSD-3-Clause
*/

import { expectSaga } from 'redux-saga-test-plan'
import { UnitActionTypes, saga as  handleSaveMember, UnitPermissions, IUnitMemberRequest } from './store'
import { apiFn, apiResources } from '../effects';

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
        id: 0,
        unitId: 1, 
        personId: 3, 
        title: "Mr Manager", 
        role: "Leader", 
        permissions: UnitPermissions.Viewer, 
        percentage: 100 
    };

    describe ('creating', () => {
        const path = apiResources.units.members(member.unitId);
        const state = { form: { addMemberForm: { values: member } } };
        it("happy path", async () => {
            await sagaApiHappyPath(handleSaveMember, state, "post", path, member, UnitActionTypes.UNIT_SAVE_MEMBER_SUCCESS)
        });
        it("sad path", async () =>
            await sagaApiSadPath(handleSaveMember, state, UnitActionTypes.UNIT_SAVE_MEMBER_ERROR)
        );
    });

    describe('updating', () => {
        const path = apiResources.units.members(member.unitId, member.id);
        const state = { form: { addMemberForm: { values: { ...member, id:1 } } } };
        it("happy path", async () => {
            await sagaApiHappyPath(handleSaveMember, state, "put", path, member, UnitActionTypes.UNIT_SAVE_MEMBER_SUCCESS)
        });
        it("sad path", async () =>
            await sagaApiSadPath(handleSaveMember, state, UnitActionTypes.UNIT_SAVE_MEMBER_ERROR)
        );
    });
    
});