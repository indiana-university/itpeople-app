/**
 * @jest-environment node
 */

/**
* Copyright (C) 2018 The Trustees of Indiana University
* SPDX-License-Identifier: BSD-3-Clause
*/

import * as path from 'path'
import { Pact, Matchers } from '@pact-foundation/pact'
import axios, { AxiosResponse } from 'axios'
import * as traverse from 'traverse'
import { apiEndpoints } from './components/effects';
import { IEntity, ISupportedDepartment, ISupportedDepartmentRequest, IUnitMember, IUnitMemberRequest, IUnit, IPerson, IUnitMembership } from './components/types'

const deepMatchify = (obj: Object) => traverse(obj).map(
  function (this: traverse.TraverseContext, x: any) {
    if (Array.isArray(x) && x.length > 0) {
      this.update(Matchers.eachLike(x[0]), true)
    }
    else if (this.isLeaf) {
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
const expectNoContent = (resp: AxiosResponse) => expectStatus(resp, 204);


/************************
 * Standard Pact Creators
 ************************/

const getAll = (name: string, path: string, body: any) =>
  pactServer
    .addInteraction({
      state: `at least one ${name} exists`,
      uponReceiving: `a GET request for all ${name}s`,
      withRequest: {
        method: 'GET',
        headers: authHeader,
        path: path
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
        status: 200,
        body: deepMatchify(body)
      }
    })
    .then(postToPactServer(path, body))
    .then(expectOK);

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
  parentId: 2,
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
  description: "description",
  netId: "netid",
  campus: "campus",
  campusEmail: "campus@email.com",
  campusPhone: "812/856-1234",
  position: "position",
  tools: ["tool1", "tool2"],
  responsibilities: ["rep1", "rep2"],
  location: "location",
  expertise: ["exp1", "exp2"],
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

const referenceSupportedDepartmentRequest: ISupportedDepartmentRequest = {
  id: 1,
  unitId: referenceUnit.id,
  departmentId: referenceDepartment.id
};

const referenceSupportedDepartment: ISupportedDepartment = {
  ...referenceSupportedDepartmentRequest,
  department: referenceDepartment
};

/************************
 * Tests
 ************************/

beforeAll(() => pactServer.setup())

afterAll(() => pactServer.finalize())

describe('Contracts', () => {
  /* 
  GET /departments/:id/supportingUnits
  GET /departments/:id/memberUnits
  */

  describe('People', () => {
    const resource = 'person'
    const itemPath = apiEndpoints.people.root(referencePerson.id)

    it('gets a single person', async () => await getOne(resource, itemPath, referencePerson))
  })

  describe('Unit memberships for a person', () => {
    const resource = 'membership'
    const setPath = apiEndpoints.people.memberships(referencePerson.id)
    const itemPath = apiEndpoints.people.memberships(referencePerson.id, referenceUnitMember.id)

    it('gets all unit memberships for a person', async () => await getAll(resource, setPath, [referenceUnitMembership]))
    it('gets a single unit membership for a person', async () => await getOne(resource, itemPath, referenceUnitMembership))
  })

  describe('Departments', () => {
    const resource = 'department'
    const setPath = apiEndpoints.departments(referenceDepartment.id)

    it('gets a single department', async () => await getOne(resource, setPath, referenceDepartment))
  })

  describe('Units', () => {
    const resource = "unit"
    const setPath = apiEndpoints.units.root();
    const itemPath = apiEndpoints.units.root(referenceUnit.id);

    it('gets all units', async () => {
      await getAll(resource, setPath, referenceUnit);
    })
    it('gets a single unit', async () => {
      await getOne(resource, itemPath, referenceUnit);
    })
    it('creates a new unit', async () => {
      await create(resource, setPath, { ...referenceUnit, id: 0, parentId: 1 })
    })
    it('updates an existing unit', async () => {
      await update(resource, itemPath, referenceUnit)
    })
    it('deletes an existing unit', async () => {
      await delete_(resource, itemPath)
    })
  })

  describe('Unit Memberships', () => {
    const resource = "unit member"
    const setPath = apiEndpoints.units.members(referenceUnitMember.unitId)
    const itemPath = apiEndpoints.units.members(referenceUnitMember.unitId, referenceUnitMember.id)

    it('gets all unit memberships', async () => {
      await getAll(resource, setPath, referenceUnitMember);
    })
    it('gets a single unit member', async () => {
      await getOne(resource, itemPath, referenceUnitMember);
    })
    it('creates a new unit', async () => {
      await create(resource, setPath, { ...referenceUnitMemberRequest, id: 0 })
    })
    it('updates an existing unit member', async () => {
      await update(resource, itemPath, referenceUnitMemberRequest)
    })
    it('deletes an existing unit member', async () => {
      await delete_(resource, itemPath)
    })
  })

  describe('Supported Departments', () => {
    const resource = "supported department"
    const setPath = apiEndpoints.units.supportedDepartments(referenceSupportedDepartment.unitId)
    const itemPath = apiEndpoints.units.supportedDepartments(referenceSupportedDepartment.unitId, referenceSupportedDepartment.id)

    it('gets all supported departments', async () => {
      await getAll(resource, setPath, referenceSupportedDepartment);
    })
    it('gets a single unit member', async () => {
      await getOne(resource, itemPath, referenceSupportedDepartment);
    })
    it('creates a new unit', async () => {
      await create(resource, setPath, { ...referenceSupportedDepartmentRequest, id: 0 })
    })
    it('updates an existing unit member', async () => {
      await update(resource, itemPath, referenceSupportedDepartmentRequest)
    })
    it('deletes an existing unit member', async () => {
      await delete_(resource, itemPath)
    })
  })

  describe('Unit Children', () => {
    const resource = "unit child"
    const setPath = apiEndpoints.units.children(referenceUnit.id)

    it('gets all unit children', async () => {
      await getAll(resource, setPath, referenceUnit);
    })
  })

});

/*


  describe('creating/updating a unit membership', () => {
    // const path = "/units/4/members/1";
    // it('creates a membership', async () => {
    //   const fixtureUnit = (await getFixture(`/allUnits/4`)).data
    //   const { id, ...postBody } = fixtureUnit
    //   await pactServer.addInteraction({
    //     state: 'units may be created',
    //     uponReceiving: 'a POST request to create a unit',
    //     withRequest: {
    //       method: 'POST',
    //       headers: { ...authHeader, ...contentTypeHeader },
    //       path: path,
    //       body: postBody
    //     },
    //     willRespondWith: {
    //       status: 201,
    //       headers: { ...{ Location: Matchers.like(`${path}/1`) }, ...contentTypeHeader },
    //       body: Matchers.like(fixtureUnit)
    //     }
    //   })
    //   const pactResponseStatus = (await postPact(path, postBody)).status
    //   expect(pactResponseStatus).toEqual(201)
    // })
  })

  describe('deleting a unit', () => {

    const recordId = 1
    const path = apiEndpoints.units.root(recordId);

    it('works', async () => {
      await pactServer.addInteraction({
        state: `${path} exists`,
        uponReceiving: `a DELETE request for ${path}`,
        withRequest: {
          method: 'DELETE',
          headers: authHeader,
          path: path
        },
        willRespondWith: {
          status: 204
        }
      })
      const pactResponseStatus = (await deletePact(path)).status
      expect(pactResponseStatus).toEqual(204)
    })
  });
  */
/*
describe('for people', () => {

  const peopleResource = '/people'

  describe('retrieving a person', () => {
    const recordId = 1
    const path = `${peopleResource}/${recordId}`

    it('works', async () => {
      const resource = (await getFixture(path)).data
      expect(resource).not.toEqual({})
      await pactServer.addInteraction({
        state: `person ${recordId} exists`,
        uponReceiving: `a GET request for person ${recordId}`,
        withRequest: {
          method: 'GET',
          headers: authHeader,
          path: path
        },
        willRespondWith: {
          status: 200,
          headers: contentTypeHeader,
          body: deepMatchify(resource)
        }
      })
      const pactResponseBody = (await getPact(path)).data
      expect(pactResponseBody).not.toEqual({})
    })
  })

  describe('retrieving the current user profile', () => {

    const path = '/me'

    it('works', async () => {

      const resource = (await getFixture(path)).data
      await pactServer.addInteraction({
        state: 'there is a user logged in for whom a profile exists',
        uponReceiving: 'a GET request to retrieve my profile',
        withRequest: {
          headers: authHeader,
          method: 'GET',
          path: path
        },
        willRespondWith: {
          status: 200,
          headers: contentTypeHeader,
          body: deepMatchify(resource)
        }
      })
      const pactResponseBody = (await getPact(path)).data
      expect(pactResponseBody).not.toEqual({})
    })
  })

  describe('updating location of an existing person', async () => {

    const recordId = 5
    const path = `${peopleResource}/${recordId}`

    it('works', async () => {
      const resource = (await getFixture(path)).data
      const putBody = { ...resource, location: 'CIB sub-sub-basement' }
      await pactServer.addInteraction({
        state: `person ${recordId} exists`,
        uponReceiving: `a PUT request to update location for person ${recordId}`,
        withRequest: {
          method: 'PUT',
          headers: { ...authHeader, ...contentTypeHeader },
          path: path,
          body: putBody
        },
        willRespondWith: {
          status: 200,
        }
      })
      const pactResponseStatus = (await putPact(path, putBody)).status
      expect(pactResponseStatus).toEqual(200)
    })
  })

})
describe('for departments', () => {

  const departmentsResource = '/departments'

  describe('retrieving a department', () => {

    const recordId = 1
    const path = `${departmentsResource}/${recordId}`

    it('works', async () => {
      const resource = (await getFixture(path)).data
      await pactServer.addInteraction({
        state: `${path} exists`,
        uponReceiving: `a GET request for ${path}`,
        withRequest: {
          method: 'GET',
          headers: authHeader,
          path: path
        },
        willRespondWith: {
          status: 200,
          headers: contentTypeHeader,
          body: deepMatchify(resource)
        }
      })
      const pactResponseBody = (await getPact(path)).data
      expect(pactResponseBody).not.toEqual({})
    })
  })
  describe('retrieving all departments', () => {

    const path = departmentsResource

    it('works', async () => {
      const resource = (await getFixture(path)).data
      await pactServer.addInteraction({
        state: 'at least one department exists',
        uponReceiving: 'a GET request to list departments',
        withRequest: {
          method: 'GET',
          headers: authHeader,
          path: path
        },
        willRespondWith: {
          status: 200,
          headers: contentTypeHeader,
          body: deepMatchify(resource)
        }
      })
      const pactResponseBody = (await getPact(path)).data
      expect(pactResponseBody).not.toEqual({})
    })

  })

  describe('updating attributes of a department', () => {

    const recordId = 1
    const path = `${departmentsResource}/${recordId}`

    it('works', async () => {
      const fixtureDept = (await getFixture(`/allDepartments/${recordId}`)).data
      const { id, ...putBody } = fixtureDept
      await pactServer.addInteraction({
        state: `${path} exists`,
        uponReceiving: `a PUT request to update department ${recordId}`,
        withRequest: {
          method: 'PUT',
          headers: { ...authHeader, ...contentTypeHeader },
          path: path,
          body: putBody
        },
        willRespondWith: {
          status: 200,
        }
      })
      const pactResponseStatus = (await putPact(path, putBody)).status
      expect(pactResponseStatus).toEqual(200)
    })
  })

  describe('creating a new department', () => {

    const path = departmentsResource

    it('works', async () => {
      const fixtureDept = (await getFixture('/allDepartments/1')).data
      const { id, ...postBody } = fixtureDept
      await pactServer.addInteraction({
        state: 'no state',
        uponReceiving: `a POST request for ${path}`,
        withRequest: {
          method: 'POST',
          headers: { ...authHeader, ...contentTypeHeader },
          path: path,
          body: postBody
        },
        willRespondWith: {
          status: 201,
          headers: { ...{ Location: Matchers.like(`${path}/1`) }, ...contentTypeHeader },
          body: Matchers.like(fixtureDept)
        }
      })
      const pactResponseStatus = (await postPact(path, postBody)).status
      expect(pactResponseStatus).toEqual(201)
    })
  })

  describe('deleting a department', () => {

    const recordId = 1
    const path = `${departmentsResource}/${recordId}`

    it('works', async () => {
      await pactServer.addInteraction({
        state: `${path} exists`,
        uponReceiving: `a DELETE request for ${path}`,
        withRequest: {
          method: 'DELETE',
          headers: authHeader,
          path: path
        },
        willRespondWith: {
          status: 204
        }
      })
      const pactResponseStatus = (await deletePact(path)).status
      expect(pactResponseStatus).toEqual(204)
    })
  })

})
})

describe('searching for "park"', () => {

const path = '/search'
const searchTerm = 'park'
const queryParam = `?term=${searchTerm}`

it('works', async () => {
  const resource = (await getFixture(path + queryParam)).data
  await pactServer.addInteraction({
    state: "data exists to be returned by term 'park'",
    uponReceiving: "a GET request to search with term 'park'",
    withRequest: {
      method: 'GET',
      headers: authHeader,
      path: path,
      query: {
        term: searchTerm
      }
    },
    willRespondWith: {
      status: 200,
      headers: contentTypeHeader,
      body: deepMatchify(resource)
    }
  })
  const pactResponseBody = (await getPact(path + queryParam)).data
  expect(pactResponseBody).not.toEqual({})
})
})
*/
