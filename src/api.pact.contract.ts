/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as path from 'path'
import { Pact, Matchers, Query } from '@pact-foundation/pact'
import axios, { AxiosResponse, Method } from 'axios'
import * as traverse from 'traverse'
import { apiEndpoints } from './components/effects';
import { 
    ISupportRelationship, 
    ISupportType, 
    ISupportRelationshipRequest, 
    IUnitMember, 
    IUnitMemberRequest, 
    IUnit, 
    IPerson, 
    IUnitMembership, 
    ITool,
    IUnitMemberTool,
    IBuilding,
    IBuildingSupportRelationship,
    IBuildingSupportRelationshipRequest,
    IDepartment} from './components/types'
import * as examples from 'src/db.json'

const deepMatchify = (obj: Object) => traverse(obj).map(
    function (this: traverse.TraverseContext, x: any) {
        if (Array.isArray(x) && x.length > 0) {
            this.update(Matchers.eachLike(x[0]), true)
        }
        else if (this.isLeaf && x) {

            this.update(Matchers.like(x), true)
        }
    })

const PACT_PORT = 6123
const PACT_SERVER = `http://localhost:${PACT_PORT}`
//const JSON_SERVER = 'http://localhost:3001'

const pactServer = new Pact({
    port: PACT_PORT,
    log: path.resolve(__dirname, '../contracts/pact-server.log'),
    dir: path.resolve(__dirname, '../contracts'),
    spec: 2,
    consumer: 'itpeople-app',
    provider: 'itpeople-functions'
})

const authHeader = {
    Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJqb2huZG9lIiwiZXhwIjoyOTE2MjM5MDIyfQ.ELo8I2IImgRRT75cOcUcSllbkWVWAIQA2WQr27WSpWwF2c7Wh9hjqkPriZ4PxSD4OR9IgGWt5HWpPQFDOwlv1O7tl2gLcZ5LayuRzQX2AEn-UsEBECStEwABUtwhg92q9Ov-GRbYqmP_5UpntbCr8aZfMEuMfLTIWePcORq_FrJhjyRUoKhUo8007W6RO58n03erVlslSB1f-JTYtBdhYOlgmDTOCp_rc-gPvKFePMb4c05IOD-x4ce2QGkZlL_pE1_OLKdn5A07k7B8x53v38WvWuisFGIPXUcuP3j9hdJHIzYLSfL5t1OABT1-57C91yaMAgVsATMRgT9qtzYQgg"
}

const contentTypeHeader = {
    'Content-Type': 'application/json; charset=utf-8'
}

const axiosRequest =
    (method: string, server: string, path: string, data = {}, headers = { ...authHeader, ...contentTypeHeader }) =>
        axios.request({
            method: method as Method,
            url: `${server}${path}`,
            headers: headers,
            data: data
        })

const getFromPactServer = (path: string) => (_: any) => axiosRequest('GET', PACT_SERVER, path)
const putToPactServer = (path: string, data: Object) => (_: any) => axiosRequest('PUT', PACT_SERVER, path, data)
const postToPactServer = (path: string, data: Object) => (_: any) => axiosRequest('POST', PACT_SERVER, path, data)
const deleteFromPactServer = (path: string) => (_: any) => axiosRequest('DELETE', PACT_SERVER, path)

const expectStatus = (resp: AxiosResponse, status: number) => expect(resp.status).toEqual(status);
const expectOK = (resp: AxiosResponse) => expectStatus(resp, 200);
const expectCreated = (resp: AxiosResponse) => expectStatus(resp, 201);
const expectNoContent = (resp: AxiosResponse) => expectStatus(resp, 204);


/************************
 * Standard Pact Creators
 ************************/

const getAll = (name: string, path: string, body: any, query?: Query) =>
    pactServer
        .addInteraction({
            state: `at least one ${name} exists`,
            uponReceiving: `a GET request for all ${name}s`,
            withRequest: {
                method: 'GET',
                headers: authHeader,
                path: path,
                query: query
            },
            willRespondWith: {
                status: 200,
                headers: contentTypeHeader,
                body: deepMatchify([body])
            }
        })
        .then(getFromPactServer(path))
        .then(expectOK);

const getOne = (name: string, path: string, body: any) =>
    pactServer
        .addInteraction({
            state: `${name} exists`,
            uponReceiving: `a GET request for one ${name}`,
            withRequest: {
                method: "GET",
                headers: authHeader,
                path: path
            },
            willRespondWith: {
                status: 200,
                headers: contentTypeHeader,
                body: deepMatchify(body)
            }
        })
        .then(getFromPactServer(path))
        .then(expectOK);

const create = (name: string, path: string, body: any, responseBody?: any) =>
    pactServer
        .addInteraction({
            state: `${name} may be created`,
            uponReceiving: `a POST request to create a ${name}`,
            withRequest: {
                method: "POST",
                headers: { ...authHeader, ...contentTypeHeader },
                path: path,
                body: body
            },
            willRespondWith: {
                status: 201,
                body: deepMatchify(responseBody || body)
            }
        })
        .then(postToPactServer(path, body))
        .then(expectCreated);

const update = (name: string, path: string, body: any, responseBody?: any) =>
    pactServer
        .addInteraction({
            state: `${name} exists`,
            uponReceiving: `a PUT request to update a ${name}`,
            withRequest: {
                method: "PUT",
                headers: { ...authHeader, ...contentTypeHeader },
                path: path,
                body: body
            },
            willRespondWith: {
                status: 200,
                body: deepMatchify(body)
            }
        })
        .then(putToPactServer(path, responseBody || body))
        .then(expectOK);


const delete_ = (name: string, path: string) =>
    pactServer
        .addInteraction({
            state: `${name} exists`,
            uponReceiving: `a DELETE request to delete a ${name}`,
            withRequest: {
                method: "DELETE",
                headers: { ...authHeader, ...contentTypeHeader },
                path: path
            },
            willRespondWith: {
                status: 204
            }
        })
        .then(deleteFromPactServer(path))
        .then(expectNoContent);


/************************
 * Reference Objects
 ************************/

const referenceUnit: IUnit = { ...examples.units[0], parentId:undefined }
const referenceDepartment: IDepartment = examples.departments[0]
const referenceSupportType: ISupportType = examples.supportTypes[0]
const referenceBuilding: IBuilding = examples.buildings[0]
const referencePerson: IPerson = examples.people[0]
const referenceTool: ITool = examples.tools[0];
const referenceMemberTool: IUnitMemberTool = examples.memberTools[0]

const referenceUnitMemberRequest: IUnitMemberRequest = {
    id: 1,
    unitId: referenceUnit.id,
    personId: referencePerson.id,
    title: "title",
    role: "Leader",
    percentage: 100,
    permissions: "Viewer"
};
const referenceUnitMemberRequestByNetId: IUnitMemberRequest = {
    id: 1,
    unitId: referenceUnit.id,
    netId: referencePerson.netId,
    title: "title",
    role: "Leader",
    percentage: 100,
    permissions: "Viewer"
};

const referenceUnitMember: IUnitMember = {
    ...referenceUnitMemberRequest,
    person: referencePerson,
    memberTools: [ referenceMemberTool ]
};
const referenceUnitMembership: IUnitMembership = {
    ...referenceUnitMemberRequest,
    unit: referenceUnit
};

const referenceSupportRelationshipRequest: ISupportRelationshipRequest = {
    id: 1,
    unitId: referenceUnit.id,
    departmentId: referenceDepartment.id,
    supportTypeId: referenceSupportType.id
};

const referenceSupportRelationship: ISupportRelationship = {
    ...referenceSupportRelationshipRequest,
    department: referenceDepartment,
    unit: referenceUnit,
    supportType: referenceSupportType

};

const referenceBuildingRelationshipRequest: IBuildingSupportRelationshipRequest = {
    id: 1,
    unitId: referenceUnit.id,
    buildingId: referenceBuilding.id
};

const referenceBuildingRelationship: IBuildingSupportRelationship = {
    ...referenceBuildingRelationshipRequest,
    building: referenceBuilding,
    unit: referenceUnit
};

const referenceMemberToolRequest: IUnitMemberTool = {
    id: 1,
    membershipId: referenceUnitMember.id||0,
    toolId: referenceTool.id
};


/************************
 * Tests
 ************************/

beforeAll(() => pactServer.setup())

afterAll(() => pactServer.finalize())

describe('Contracts', () => {

    describe('People', () => {
        const resource = 'person'
        const setPath = apiEndpoints.people.root();
        const itemPath = apiEndpoints.people.root(referencePerson.id)

        it('gets all people', async () =>
            await getAll(resource, setPath, referencePerson))
        it('gets a single person', async () =>
            await getOne(resource, itemPath, referencePerson))
    })

    describe("People search", () => {
        const resource = "person search";
        const itemPath = apiEndpoints.people.root();

        it("gets all matching people", async () =>
            await getAll(resource, itemPath, referencePerson, "q=swanson"))
    });

    describe('Unit memberships for a person', () => {
        const resource = 'memberships by person'
        const setPath = apiEndpoints.people.memberships(referencePerson.id)

        it('gets all unit memberships for a person', async () =>
            await getAll(resource, setPath, referenceUnitMembership))
    })

    describe('Memberships', () => {
        const resource = 'membership'
        const setPath = apiEndpoints.memberships()
        const itemPath = apiEndpoints.memberships(referenceUnitMember.id)

        /*
         * JFH: The 'gets all memberships' test was removed because Pact doesn't support nullable fields.
         * Some of our test memberships are related to people, and some (vacancies) are not.
         * The contract thus fails even though the API is doing the right thing.
         * I'm leaving it here with this note in the event that some future developer (probably me) is tempted to add the test back.
         */
        // it('gets all memberships', async () =>
        //   await getAll(resource, setPath, referenceUnitMemberRequest))
        it('gets a single membership', async () =>
            await getOne(resource, itemPath, referenceUnitMemberRequest))
        it('creates a new membership', async () =>
            await create(resource, setPath, referenceUnitMemberRequest))
        it('updates an existing membership', async () =>
            await update(resource, itemPath, referenceUnitMemberRequest))
        it('deletes an existing membership', async () =>
            await delete_(resource, itemPath))

        const resourceByNetId = 'membership from netID'
        // With netId instead of personId
        it('creates a new membership from netID', async () =>
            await create(resourceByNetId, setPath, referenceUnitMemberRequestByNetId, referenceUnitMemberRequest))
        it('updates an existing membership', async () =>
            await update(resourceByNetId, itemPath, referenceUnitMemberRequestByNetId, referenceUnitMemberRequest))
    })

    describe('Departments', () => {
        const resource = 'department'
        const setPath = apiEndpoints.departments.root();
        const itemPath = apiEndpoints.departments.root(referenceDepartment.id);

        it("gets all departments", async () =>
            await getAll(resource, setPath, referenceDepartment))
        it('gets a single department', async () =>
            await getOne(resource, itemPath, referenceDepartment))
    })

    describe("Department search", () => {
        const resource = "department search";
        const itemPath = apiEndpoints.departments.root();

        it("gets all matching departments", async () =>
            await getAll(resource, itemPath, referenceDepartment, "q=parks"));
    });
    describe('Support Types', () => {
        const resource = 'supportType'
        const setPath = apiEndpoints.supportTypes.root();

        it("gets all support types", async () =>
            await getAll(resource, setPath, referenceDepartment))
    })

    describe('Buildings', () => {
        const resource = 'building'
        const setPath = apiEndpoints.buildings.root();
        const itemPath = apiEndpoints.buildings.root(referenceBuilding.id);

        it("gets all buildings", async () =>
            await getAll(resource, setPath, referenceBuilding))
        it('gets a single building', async () =>
            await getOne(resource, itemPath, referenceBuilding))
    })

    describe("Building search", () => {
        const resource = "building search";
        const itemPath = apiEndpoints.buildings.root();

        it("gets all matching buildings", async () =>
            await getAll(resource, itemPath, referenceBuilding, "q=city"));
    });


    describe('Units in a Department', () => {
        const resource = 'memberUnits'

        it('gets units in a department', async () =>
            await getOne(resource, apiEndpoints.departments.memberUnits(referenceDepartment.id), [referenceUnit]))
    })

    describe('Units supporting a Department', () => {
        const resource = 'department supportingUnits'
        const body = { ...referenceSupportRelationship, department: undefined }
        it('gets units supporting a department', async () =>
            await getOne(resource, apiEndpoints.departments.supportingUnits(referenceDepartment.id), [body]))
    })

    describe('Units supporting a Building', () => {
        const resource = 'building supportingUnits'
        const body = { ...referenceBuildingRelationship, building: undefined }
        it('gets units supporting a building', async () =>
            await getOne(resource, apiEndpoints.buildings.supportingUnits(referenceBuilding.id), [body]))
    })

    describe('Units', () => {
        const resource = "unit"
        const setPath = apiEndpoints.units.root();
        const itemPath = apiEndpoints.units.root(referenceUnit.id);

        it('gets all units', async () =>
            await getAll(resource, setPath, referenceUnit))
        it('gets a single unit', async () =>
            await getOne(resource, itemPath, referenceUnit))

    })

    describe("Unit search", () => {
        const resource = "unit search";
        const itemPath = apiEndpoints.units.root();

        it("gets all matching units", async () =>
            await getAll(resource, itemPath, referenceUnit, { "q": "parks" }));
    });


    describe('Unit Memberships', () => {
        const resource = "memberships by unit"
        const setPath = apiEndpoints.units.members(referenceUnitMember.unitId)

        it('gets all unit memberships', async () =>
            await getAll(resource, setPath, referenceUnitMember))
    })

    describe('Supported Departments', () => {
        const resource = "supported department"
        const setPath = apiEndpoints.units.supportedDepartments(referenceSupportRelationship.unitId)
        const body = { ...referenceSupportRelationship, unit: undefined }
        it('gets all supported departments', async () =>
            await getAll(resource, setPath, body))
    })

    describe('Supported Buildings', () => {
        const resource = "supported building"
        const setPath = apiEndpoints.units.supportedBuildings(referenceSupportRelationship.unitId)
        const body = { ...referenceBuildingRelationship, unit: undefined }
        it('gets all supported buildings', async () =>
            await getAll(resource, setPath, body))
    })

    describe('Support Relationships', () => {
        const resource = "support relationship"
        const setPath = apiEndpoints.supportRelationships()
        const itemPath = apiEndpoints.supportRelationships(referenceSupportRelationship.id)

        it('gets all support relationships', async () =>
            await getAll(resource, setPath, referenceSupportRelationshipRequest))
        it('gets a single support relationship', async () =>
            await getOne(resource, itemPath, referenceSupportRelationshipRequest))
        // JFH: Set unitId:2 to prevent 409 conflict when creating new support relationship.
        it('creates a new support relationships', async () =>
            await create(resource, setPath, { ...referenceSupportRelationshipRequest, unitId: 2 }))
        it('updates an existing support relationships', async () =>
            await update(resource, itemPath, referenceSupportRelationshipRequest))
        it('deletes an existing support relationships', async () =>
            await delete_(resource, itemPath))
    })

    describe('Building Relationships', () => {
        const resource = "building relationship"
        const setPath = apiEndpoints.buildingRelationships()
        const itemPath = apiEndpoints.buildingRelationships(referenceBuildingRelationship.id)

        it('gets all building relationships', async () =>
            await getAll(resource, setPath, referenceBuildingRelationshipRequest))
        it('gets a single building relationship', async () =>
            await getOne(resource, itemPath, referenceBuildingRelationshipRequest))
        // JFH: Set unitId:2 to prevent 409 conflict when creating new building relationship.
        it('creates a new building relationships', async () =>
            await create(resource, setPath, { ...referenceBuildingRelationshipRequest, unitId: 2 }))
        it('updates an existing building relationships', async () =>
            await update(resource, itemPath, referenceBuildingRelationshipRequest))
        it('deletes an existing building relationships', async () =>
            await delete_(resource, itemPath))
    })

    describe('Member Tools', () => {
        const resource = "unit member tools"
        const setPath = apiEndpoints.memberTools()
        const itemPath = apiEndpoints.memberTools(referenceMemberTool.id)

        it('gets all unit member tools', async () =>
            await getAll(resource, setPath, referenceMemberToolRequest))
        it('gets a single unit member tool', async () =>
            await getOne(resource, itemPath, referenceMemberToolRequest))
        it('creates a new unit member tool', async () =>
            await create(resource, setPath, referenceMemberToolRequest))
        it('updates an existing unit member tool', async () =>
            await update(resource, itemPath, referenceMemberToolRequest))
        it('deletes an existing unit member tool', async () =>
            await delete_(resource, itemPath))
    })


    describe('Unit Children', () => {
        const resource = "unit child"
        const setPath = apiEndpoints.units.children(referenceUnit.id)

        it('gets all unit children', async () =>
            await getAll(resource, setPath, referenceUnit))
    })

    describe("Unit Tools", () => {
      const resource = "unit tools";
      const setPath = apiEndpoints.units.tools(referenceUnit.id);

      it("gets all unit tools", async () => 
        await getAll(resource, setPath, referenceTool));
    });
});