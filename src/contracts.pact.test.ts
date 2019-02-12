/**
 * @jest-environment node
 */

/**
* Copyright (C) 2018 The Trustees of Indiana University
* SPDX-License-Identifier: BSD-3-Clause
*/

import * as path from 'path'
import { Pact, Matchers, Query } from '@pact-foundation/pact'
import axios, { AxiosResponse } from 'axios'
import * as traverse from 'traverse'
import { apiEndpoints } from './components/effects';
import { IEntity, ISupportRelationship, ISupportRelationshipRequest, IUnitMember, IUnitMemberRequest, IUnit, IPerson, IUnitMembership } from './components/types'

const deepMatchify = (obj: Object) => traverse(obj).map(
  function (this: traverse.TraverseContext, x: any) {
    if (Array.isArray(x) && x.length > 0) {
      this.update(Matchers.eachLike(x[0]), true)
    }
    else if (this.isLeaf && x) {
      
      this.update(Matchers. like(x), true)
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
  Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOiIxOTE1NTQ0NjQzIiwidXNlcl9pZCI6IjEiLCJ1c2VyX25hbWUiOiJqb2huZG9lIn0.9uerDlhPKrtBrMMHuRoxbJ5x0QA7KOulDEHx9DKXpnQ"
}

const contentTypeHeader = {
  'Content-Type': 'application/json; charset=utf-8'
}

const axiosRequest =
  (method: string, server: string, path: string, data = {}, headers = { ...authHeader, ...contentTypeHeader }) =>
    axios.request({
      method: method,
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

const create = (name: string, path: string, body: any) =>
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
        body: deepMatchify(body)
      }
    })
    .then(postToPactServer(path, body))
    .then(expectCreated);

const update = (name: string, path: string, body: any) =>
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
    .then(putToPactServer(path, body))
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

const referenceUnit: IUnit = {
  id: 1,
  name: "name",
  description: "description",
  parentId: undefined,
  url: "url"
};

const referenceDepartment: IEntity = {
  id: 1,
  name: "name",
  description: "description"
};

const referencePerson: IPerson = {
  id: 1,
  name: "name",
  netId: "netid",
  campus: "campus",
  campusEmail: "campus@email.com",
  campusPhone: "812/856-1234",
  position: "position",
  tools: "tool1; tool2",
  responsibilities: "rep1; rep2",
  location: "location",
  expertise: "exp1; exp2",
  photoUrl: "http://photo.url"
};

const referenceUnitMemberRequest: IUnitMemberRequest = {
  id: 1,
  unitId: referenceUnit.id,
  personId: referencePerson.id,
  title: "title",
  role: "Leader",
  percentage: 100,
  permissions: "Viewer"
};
const referenceUnitMember: IUnitMember = {
  ...referenceUnitMemberRequest,
  person: referencePerson
};
const referenceUnitMembership: IUnitMembership = {
  ...referenceUnitMemberRequest,
  unit: referenceUnit
};

const referenceSupportRelationshipRequest: ISupportRelationshipRequest = {
  id: 1,
  unitId: referenceUnit.id,
  departmentId: referenceDepartment.id
};

const referenceSupportRelationship: ISupportRelationship = {
  ...referenceSupportRelationshipRequest,
  department: referenceDepartment,
  unit: referenceUnit
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


  describe('Units in a Department', () => {
    const resource = 'memberUnits'

    it('gets units in a department', async () =>
      await getOne(resource, apiEndpoints.departments.memberUnits(referenceDepartment.id), [referenceUnit]))
  })

  describe('Units supporting a Department', () => {
    const resource = 'supportingUnits'
    const body = { ...referenceSupportRelationship, department: undefined }
    it('gets units supporting a department', async () => 
      await getOne(resource, apiEndpoints.departments.supportingUnits(referenceDepartment.id), [body]))
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
      await getAll(resource, itemPath, referenceUnit, {"q":"parks"}));
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
    const body = {... referenceSupportRelationship, unit: undefined}
    it('gets all supported departments', async () => 
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
    it('creates a new support relationships', async () =>
      await create(resource, setPath, referenceSupportRelationshipRequest))
    it('updates an existing support relationships', async () =>
      await update(resource, itemPath, referenceSupportRelationshipRequest))
    it('deletes an existing support relationships', async () =>
      await delete_(resource, itemPath))
  })


  describe('Unit Children', () => {
    const resource = "unit child"
    const setPath = apiEndpoints.units.children(referenceUnit.id)

    it('gets all unit children', async () => 
      await getAll(resource, setPath, referenceUnit))
  })

});