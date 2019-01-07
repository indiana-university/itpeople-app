/**
 * @jest-environment node
 */

/**
* Copyright (C) 2018 The Trustees of Indiana University
* SPDX-License-Identifier: BSD-3-Clause
*/

import * as path from 'path'
import { Pact, Matchers } from '@pact-foundation/pact'
import axios from 'axios'
import * as traverse from 'traverse'
import { expectSaga } from 'redux-saga-test-plan'
import { ProfileActionTypes, saga as profileSaga } from './components/Profile/store'
import { UnitActionTypes, saga as unitSaga } from './components/Unit/store'
import { DepartmentActionTypes, saga as departmentSaga } from './components/Department/store'
import { SearchActionTypes, saga as searchSaga } from './components/Search/store'
import { Reducer } from 'redux';
import { Effect } from 'redux-saga';

const lastSagaPutActionPayload = (ar: Array<Effect>) =>
  ar[ar.length - 1]["PUT"]["action"]["payload"]

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
  (method: string, server: string, path: string, data: Object = {}, headers: Object = { ...authHeader, ...contentTypeHeader }) =>
    axios.request({
      method: method,
      url: `${server}${path}`,
      headers: headers,
      data: data
    })

const getFixture = (path: string) => axiosRequest('GET', JSON_SERVER, path)

const getPact = (path: string) => axiosRequest('GET', PACT_SERVER, path)
const putPact = (path: string, data: Object) => axiosRequest('PUT', PACT_SERVER, path, data)

beforeAll(async () => pactServer.setup())

afterAll(() => pactServer.finalize())

describe('Contracts', () => {

  describe('for units', () => {

    describe('retrieving a unit', () => {
      const recordId = 1
      const path = `/units/${recordId}`

      it('works', async () => {
        const resource = (await getFixture(path)).data
        await pactServer.addInteraction({
          state: `unit ${recordId} exists`,
          uponReceiving: `a GET request for unit ${recordId}`,
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

      it('works through app saga', async () => {
        const resource = (await getFixture(path)).data
        const reducer: Reducer = () =>
          ({
            unit: {
              request: { id: recordId }
            }
          })

        const { allEffects } = await expectSaga(unitSaga)
          .withReducer(reducer)
          .dispatch({ type: UnitActionTypes.UNIT_FETCH_REQUEST })
          .put.actionType(
            UnitActionTypes.UNIT_FETCH_SUCCESS
          )
          .run()

        const sagaPayload = lastSagaPutActionPayload(allEffects)
        expect(sagaPayload).toEqual(resource)
      })
    })
    describe('retrieving all units', () => {
      const path = '/units'

      it('works', async () => {
        const resource = (await getFixture(path)).data
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
            body: deepMatchify(resource)
          }
        })
        const pactResponseBody = (await getPact(path)).data
        expect(pactResponseBody).not.toEqual({})
      })

      it('works through app saga', async () => {
        const resource = (await getFixture(path)).data
        const reducer: Reducer = () =>
          ({
            unit: {
              request: { id: '' }
            }
          })
        const { allEffects } = await expectSaga(unitSaga)
          .withReducer(reducer)
          .dispatch({ type: UnitActionTypes.UNIT_FETCH_REQUEST })
          .put.actionType(
            UnitActionTypes.UNIT_FETCH_SUCCESS
          )
          .run()

        const sagaPayload = lastSagaPutActionPayload(allEffects)
        expect(sagaPayload).toEqual(resource)
      })
    })

    describe('updating an existing unit', async () => {
      const recordId = 1
      const path = `/units/${recordId}`
      it('works', async () => {
        let putBody = (await getFixture(`/allUnits/4`)).data
        delete putBody.id
        await pactServer.addInteraction({
          state: `unit ${recordId} exists`,
          uponReceiving: `a PUT request to update attributes for unit ${recordId}`,
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

      it('works through app saga', async () => {
        const resource = (await getFixture(path)).data
        const reducer: Reducer = () =>
          ({
            unit: {
              request: { id: recordId }
            }
          })

        const { allEffects } = await expectSaga(unitSaga)
          .withReducer(reducer)
          .dispatch({ type: UnitActionTypes.UNIT_FETCH_REQUEST })
          .put.actionType(
            UnitActionTypes.UNIT_FETCH_SUCCESS
          )
          .run()

        const sagaPayload = lastSagaPutActionPayload(allEffects)
        expect(sagaPayload).toEqual(resource)
      })

    })
  })
  describe('for profiles', () => {

    describe('retrieving a profile', () => {

      const recordId = 1
      const path = `/people/${recordId}`

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

      it('works through app saga', async () => {
        const resource = (await getFixture(path)).data
        const reducer: Reducer = () =>
          ({
            profile: {
              request: { id: recordId }
            }
          })

        const { allEffects } = await expectSaga(profileSaga)
          .withReducer(reducer)
          .dispatch({ type: ProfileActionTypes.PROFILE_FETCH_REQUEST })
          .put.actionType(
            ProfileActionTypes.PROFILE_FETCH_SUCCESS
          )
          .run()

        const sagaPayload = lastSagaPutActionPayload(allEffects)
        expect(sagaPayload).toEqual(resource)
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

      it('works through app saga', async () => {

        const resource = (await getFixture(path)).data
        const reducer: Reducer = () =>
          ({
            profile: {
              request: { id: 0 }
            }
          })

        const { allEffects } = await expectSaga(profileSaga)
          .withReducer(reducer)
          .dispatch({ type: ProfileActionTypes.PROFILE_FETCH_REQUEST })
          .put.actionType(
            ProfileActionTypes.PROFILE_FETCH_SUCCESS
          )
          .run()

        const sagaPayload = lastSagaPutActionPayload(allEffects)
        expect(sagaPayload).toEqual(resource)
      })
    })
  })

  describe('for departments', () => {

    describe('retrieving a department', () => {

      const recordId = 1
      const path = `/departments/${recordId}`

      it('works', async () => {
        const resource = (await getFixture(path)).data
        await pactServer.addInteraction({
          state: `department ${recordId} exists`,
          uponReceiving: `a GET request for department ${recordId}`,
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
      it('works through app saga', async () => {
        const resource = (await getFixture(path)).data
        const reducer: Reducer = () =>
          ({
            department: {
              request: { id: recordId }
            }
          })

        const { allEffects } = await expectSaga(departmentSaga)
          .withReducer(reducer)
          .dispatch({ type: DepartmentActionTypes.DEPARTMENT_FETCH_REQUEST })
          .put.actionType(
            DepartmentActionTypes.DEPARTMENT_FETCH_SUCCESS
          )
          .run()

        const sagaPayload = lastSagaPutActionPayload(allEffects)
        expect(sagaPayload).toEqual(resource)
      })
    })
  })
  describe('retrieving all departments', () => {

    const path = '/departments'

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

    it('works through app saga', async () => {
      const resource = (await getFixture(path)).data
      const reducer: Reducer = () =>
        ({
          department: {
            request: { id: '' }
          }
        })

      const { allEffects } = await expectSaga(departmentSaga)
        .withReducer(reducer)
        .dispatch({ type: DepartmentActionTypes.DEPARTMENT_FETCH_REQUEST })
        .put.actionType(
          DepartmentActionTypes.DEPARTMENT_FETCH_SUCCESS
        )
        .run()

      const sagaPayload = lastSagaPutActionPayload(allEffects)
      expect(sagaPayload).toEqual(resource)
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

  it('works through app saga', async () => {
    const resource = (await getFixture(path + queryParam)).data
    const reducer: Reducer = () =>
      ({
        searchSimple: {
          request: { term: searchTerm }
        }
      })

    const { allEffects } = await expectSaga(searchSaga)
      .withReducer(reducer)
      .dispatch({ type: SearchActionTypes.SEARCH_SIMPLE_FETCH_REQUEST })
      .put.actionType(
        SearchActionTypes.SEARCH_SIMPLE_FETCH_SUCCESS
      )
      .run()

    const sagaPayload = lastSagaPutActionPayload(allEffects)
    expect(sagaPayload).toEqual(resource)
  })
})
