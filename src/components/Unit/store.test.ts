/**
 * @jest-environment node
 */

/**
* Copyright (C) 2018 The Trustees of Indiana University
* SPDX-License-Identifier: BSD-3-Clause
*/

import { expectSaga } from 'redux-saga-test-plan'
import * as unit from './store'
import { apiFn, apiResources } from '../effects';

const sagaApiHappyPath = async (saga: any, request: any, expectedMethod: string, expectedPath: string, expectedDispatch: string, expectedPayload: any) => {
    const api: apiFn = (m, u, p, d, h) => {
        expect(m).toEqual(expectedMethod);
        expect(p).toEqual(expectedPath);
        return Promise.resolve({});
    }
    await expectSaga(saga, api, request)
      .put({ type: expectedDispatch, payload: expectedPayload, meta: undefined })
      .silentRun(50);
}

const sagaApiSadPath = async (saga: any, request: any, expectedDispatch: string) => {
    const api: apiFn = (m, u, p, d, h) =>
        Promise.resolve({ errors: ["Error"] });
    await expectSaga(saga, api, request)
        .put({ type: expectedDispatch, payload: ["Error"], meta: undefined })
        .silentRun(50);
};

describe('unit memberships', () => {

    const member: unit.IUnitMemberRequest = { 
        unitId: 1, 
        personId: 3, 
        title: "Mr Manager", 
        role: "Leader", 
        permissions: unit.UnitPermissions.Viewer, 
        percentage: 100 
    };

    const expectedSuccessDispatch = unit.UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST;
    const expectedSuccessPayload = { id: member.unitId };

    describe ('creating', () => {
        const request = {...member, id: undefined }
        const expectedPath = apiResources.units.members(member.unitId);
        it("happy path", async () => {
            await sagaApiHappyPath(unit.handleSaveMember, request, "post", expectedPath, expectedSuccessDispatch, expectedSuccessPayload);
        });
        it("sad path", async () =>
            await sagaApiSadPath(unit.handleSaveMember, request, unit.UnitActionTypes.UNIT_SAVE_MEMBER_ERROR)
        );
    });

    describe('updating', () => {
        const request = { ...member, id: 1 }
        const expectedPath = apiResources.units.members(member.unitId, request.id);
        it("happy path", async () => {
            await sagaApiHappyPath(unit.handleSaveMember, request, "put", expectedPath, expectedSuccessDispatch, expectedSuccessPayload);
        });
        it("sad path", async () => {
            await sagaApiSadPath(unit.handleSaveMember, request, unit.UnitActionTypes.UNIT_SAVE_MEMBER_ERROR);
        });
    });

    describe('deleting', () => {
        const request = { ...member, id: 1 }
        const expectedPath = apiResources.units.members(member.unitId, request.id);
        it("happy path", async () => {
            await sagaApiHappyPath(unit.handleDeleteMember, request, "delete", expectedPath, expectedSuccessDispatch, expectedSuccessPayload);
        });
        it("sad path", async () => {
            await sagaApiSadPath(unit.handleDeleteMember, request, unit.UnitActionTypes.UNIT_DELETE_MEMBER_ERROR);
        });
    });

});