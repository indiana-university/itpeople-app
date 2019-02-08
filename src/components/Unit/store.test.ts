/**
 * @jest-environment node
 */

/**
* Copyright (C) 2018 The Trustees of Indiana University
* SPDX-License-Identifier: BSD-3-Clause
*/

import { expectSaga } from 'redux-saga-test-plan'
import * as unit from './store'
import { apiEndpoints } from '../effects';
import { UnitPermissions, IUnitMemberRequest, ISupportedDepartmentRequest, IUnit } from '../types';
import { IApiCall, restApi } from '../api';

const sagaApiHappyPath = async (saga: any, request: any, expectedMethod: string, expectedPath: string, expectedDispatch: string, expectedPayload: any) => {
    const apiCaller: IApiCall = (m, u, p, d, h): Promise<any> => {
        expect(m).toEqual(expectedMethod);
        expect(p).toEqual(expectedPath);
        return Promise.resolve({});
    }
    const api = restApi("", apiCaller);
    await expectSaga(saga, api, request)
      .put({ type: expectedDispatch, payload: expectedPayload, meta: undefined })
      .silentRun(50);
}

const sagaApiSadPath = async (saga: any, request: any, expectedDispatch: string) => {
    const errors = { errors: ["Error"] };
    const apiCaller: IApiCall = (m, u, p, d, h): Promise<any>=>
        Promise.reject(errors);
    const api = restApi("", apiCaller);
    await expectSaga(saga, api, request)
        .put({ type: expectedDispatch, payload: errors, meta: undefined })
        .silentRun(50);
};

describe('unit memberships', () => {

    const model: IUnitMemberRequest = { 
        unitId: 1, 
        personId: 3, 
        title: "Mr Manager", 
        role: "Leader", 
        permissions: UnitPermissions.Viewer, 
        percentage: 100 
    };

    const expectedSuccessDispatch = unit.UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST;
    const expectedSuccessPayload = { id: model.unitId };

    describe ('creating', () => {
        const request = {...model, id: undefined }
        const expectedPath = apiEndpoints.memberships();
        it("happy path", async () => {
            await sagaApiHappyPath(unit.handleSaveMember, request, "post", expectedPath, expectedSuccessDispatch, expectedSuccessPayload);
        });
        it("sad path", async () =>
            await sagaApiSadPath(unit.handleSaveMember, request, unit.UnitActionTypes.UNIT_SAVE_MEMBER_ERROR)
        );
    });

    describe('updating', () => {
        const request = { ...model, id: 1 }
        const expectedPath = apiEndpoints.memberships(request.id);
        it("happy path", async () => {
            await sagaApiHappyPath(unit.handleSaveMember, request, "put", expectedPath, expectedSuccessDispatch, expectedSuccessPayload);
        });
        it("sad path", async () => {
            await sagaApiSadPath(unit.handleSaveMember, request, unit.UnitActionTypes.UNIT_SAVE_MEMBER_ERROR);
        });
    });

    describe('deleting', () => {
        const request = { ...model, id: 1 }
        const expectedPath = apiEndpoints.memberships(request.id);
        it("happy path", async () => {
            await sagaApiHappyPath(unit.handleDeleteMember, request, "delete", expectedPath, expectedSuccessDispatch, expectedSuccessPayload);
        });
        it("sad path", async () => {
            await sagaApiSadPath(unit.handleDeleteMember, request, unit.UnitActionTypes.UNIT_DELETE_MEMBER_ERROR);
        });
    });

});


describe('supported departments', () => {

    const model: ISupportedDepartmentRequest = {
        unitId: 1,
        departmentId: 2
    };

    const expectedSuccessDispatch = unit.UnitActionTypes.UNIT_FETCH_DEPARTMENTS_REQUEST;
    const expectedSuccessPayload = { id: model.unitId };

    describe('creating', () => {
        const request = { ...model, id: undefined }
        const expectedPath = apiEndpoints.units.supportedDepartments(model.unitId);
        it("happy path", async () => {
            await sagaApiHappyPath(unit.handleSaveDepartment, request, "post", expectedPath, expectedSuccessDispatch, expectedSuccessPayload);
        });
        it("sad path", async () =>
            await sagaApiSadPath(unit.handleSaveDepartment, request, unit.UnitActionTypes.UNIT_SAVE_DEPARTMENT_ERROR)
        );
    });

    describe('deleting', () => {
        const request = { ...model, id: 1 }
        const expectedPath = apiEndpoints.units.supportedDepartments(model.unitId, request.id);
        it("happy path", async () => {
            await sagaApiHappyPath(unit.handleDeleteDepartment, request, "delete", expectedPath, expectedSuccessDispatch, expectedSuccessPayload);
        });
        it("sad path", async () => {
            await sagaApiSadPath(unit.handleDeleteDepartment, request, unit.UnitActionTypes.UNIT_DELETE_DEPARTMENT_ERROR);
        });
    });

});

describe('unit profile', () => {

    const model: IUnit = {
        id: 1,
        name: "unit",
        description: "description",
        url: "http://example.com",
        parentId: undefined,
    };

    const expectedSuccessDispatch = unit.UnitActionTypes.UNIT_FETCH_REQUEST;
    const expectedSuccessPayload = { id: model.id };

    describe('updating', () => {
        const request = model
        const expectedPath = apiEndpoints.units.root(model.id);
        it("happy path", async () => {
            await sagaApiHappyPath(unit.handleSaveUnit, request, "put", expectedPath, expectedSuccessDispatch, expectedSuccessPayload);
        });
        it("sad path", async () =>
            await sagaApiSadPath(unit.handleSaveUnit, request, unit.UnitActionTypes.UNIT_SAVE_PROFILE_ERROR)
        );
    });
});