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
import { apiResources } from './components/effects';
import * as unit from "./components/Unit";

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
const JSON_SERVER = 'http://localhost:3001'

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

const getFixture = (path: string) => axiosRequest('GET', JSON_SERVER, path)

const getPact = (path: string) => axiosRequest('GET', PACT_SERVER, path)
const putPact = (path: string, data: Object) => axiosRequest('PUT', PACT_SERVER, path, data)
const postPact = (path: string, data: Object) => axiosRequest('POST', PACT_SERVER, path, data)
const deletePact = (path: string) => axiosRequest('DELETE', PACT_SERVER, path)

const expectStatus = (resp: AxiosResponse, status: number) => expect(resp.status).toEqual(status);
const expectOK = (resp: AxiosResponse) => expectStatus(resp, 200);
const expectCreated = (resp: AxiosResponse) => expectStatus(resp, 201);
const expectNoContent = (resp: AxiosResponse) => expectStatus(resp, 204);
const expectUnauthorized = (resp: AxiosResponse) => expectStatus(resp, 401);
const expectNotFound = (resp: AxiosResponse) => expectStatus(resp, 404);

beforeAll(async () => pactServer.setup())

afterAll(() => pactServer.finalize())

describe('Contracts', () => {

  describe('Units', () => {

    const referenceUnit: unit.IUnit = { id: 1, name: "name", description: "description", parentId: 2, url: "url" };

    /*
    it('requires authentication to view a unit', async () => {
      await pactServer.addInteraction({
        state: 'the server requires authorization for GET /units/*',
        uponReceiving: 'an unauthorized GET request for unit 401',
        withRequest: {
          method: 'GET',
          path: apiResources.units.root()
        },
        willRespondWith: {
          status: 401
        }
      })
      expect.assertions(1)
      await expect(axios.get(`${PACT_SERVER}${path}`)).rejects.toEqual(
        new Error('Request failed with status code 401'))
    })
    */
    it('gets all units', async () => {
      const path = apiResources.units.root()
      await pactServer.addInteraction({
        state: 'at least one unit exists',
        uponReceiving: 'a GET request to list units',
        withRequest: {
          method: 'GET',
          headers: authHeader,
          path: path
        },
        willRespondWith: {
          status: 200,
          headers: contentTypeHeader,
          body: deepMatchify([referenceUnit])
        }
      })
        .then(_ => getPact(path))
        .then(expectOK);
    })
    it('gets a single unit', async () => {
      const path = apiResources.units.root(referenceUnit.id);
      await pactServer.addInteraction({
        state: `unit ${referenceUnit.id} exists`,
        uponReceiving: `a GET request for unit ${referenceUnit.id}`,
        withRequest: {
          method: "GET",
          headers: authHeader,
          path: path
        },
        willRespondWith: {
          status: 200,
          headers: contentTypeHeader,
          body: deepMatchify(referenceUnit)
        }
      })
      .then(_ => getPact(path))
      .then(expectOK);
    })
    it('creates a new unit', async () => {
      const postBody = { ...referenceUnit, id:0, parentId:1 }
      const path = apiResources.units.root()
      await pactServer.addInteraction({
        state: 'units may be created',
        uponReceiving: 'a POST request to create a unit',
        withRequest: {
          method: 'POST',
          headers: { ...authHeader, ...contentTypeHeader },
          path: path,
          body: postBody
        },
        willRespondWith: {
          status: 200,
        }
      })
      .then(_ => postPact(path, postBody))
      .then(expectOK)
    })
    it('updates an existing unit', async () => {
      const path = apiResources.units.root(referenceUnit.id)
      await pactServer.addInteraction({
        state: `unit ${referenceUnit.id} exists`,
        uponReceiving: `a PUT request to update attributes for unit ${referenceUnit.id}`,
        withRequest: {
          method: 'PUT',
          headers: { ...authHeader, ...contentTypeHeader },
          path: path,
          body: referenceUnit
        },
        willRespondWith: {
          status: 200,
        }
      })
      .then(_ => putPact(path, referenceUnit))
      .then(expectOK)
    })
    it('deletes an existing unit', async () => {
      const path = apiResources.units.root(referenceUnit.id)
      await pactServer.addInteraction({
        state: `unit ${referenceUnit.id} exists`,
        uponReceiving: `a DELETE request for ${path}`,
        withRequest: {
          method: 'DELETE',
          headers: { ...authHeader, ...contentTypeHeader },
          path: path,
        },
        willRespondWith: {
          status: 204,
        }
      })
      .then(_ => deletePact(path))
      .then(expectNoContent)
    })
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
      const path = apiResources.units.root(recordId);

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
  })
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
  */
})
