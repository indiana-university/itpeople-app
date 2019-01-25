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
import { UnitActionTypes, saga as unitSaga, handleSaveUnit, handleSaveMember } from './components/Unit/store'
import { DepartmentActionTypes, saga as departmentSaga } from './components/Department/store'
import { SearchActionTypes, saga as searchSaga } from './components/Search/store'
import { Reducer } from 'redux';
import { Effect } from 'redux-saga';
import { apiFn } from './components/effects';

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


const sagaApiHappyPath = async (saga: any, state: any, expectedMethod: string, expectedPath: string, expectedData: any, expectedDispatch: string) => {
  const api: apiFn = (m, u, p, d, h) => {
    expect(m).toEqual(expectedMethod);
    expect(p).toEqual(expectedPath);
    expect(d).toEqual(expectedData);
    return Promise.resolve({});
  }
  await expectSaga(saga, api)
    .withState(state)
    .put({
      type: expectedDispatch,
      payload: {},
      meta: undefined
    })
    .run();
}

const sagaApiSadPath = async (saga: any, state: any, expectedDispatch: string) => {
  const api: apiFn = (m, u, p, d, h) =>
    Promise.resolve({
      errors: ["Error"]
    });
  await expectSaga(saga, api)
    .withState(state)
    .put({
      type: expectedDispatch,
      payload: ["Error"],
      meta: undefined
    })
    .run();
};



beforeAll(async () => pactServer.setup())

afterAll(() => pactServer.finalize())

describe('Contracts', () => {

  describe('for units', () => {

    const unitsResource = '/units'

    it('requires authentication to view a unit', async () => {
      const path = `${unitsResource}/401`
      await pactServer.addInteraction({
        state: 'the server requires authorization for GET /units/*',
        uponReceiving: 'an unauthorized GET request for unit 401',
        withRequest: {
          method: 'GET',
          path: path
        },
        willRespondWith: {
          status: 401
        }
      })
      expect.assertions(1)
      await expect(axios.get(`${PACT_SERVER}${path}`)).rejects.toEqual(
        new Error('Request failed with status code 401'))
    })

    describe('retrieving a unit', () => {
      const recordId = 1
      const path = `${unitsResource}/${recordId}`

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
        const reducer: Reducer = () => ({ unit: { request: { id: recordId } } })
        const { allEffects } = await expectSaga(unitSaga)
          .withReducer(reducer)
          .dispatch({ type: UnitActionTypes.UNIT_FETCH_REQUEST })
          .put.actionType(
            UnitActionTypes.UNIT_FETCH_SUCCESS
          )
          .silentRun(50)

        const sagaPayload = lastSagaPutActionPayload(allEffects)
        expect(sagaPayload).toEqual(resource)
      })

      it('fails with bad id via saga', async () => {
        const reducer: Reducer = () => ({ unit: { request: { id: 10000 } } })
        await expectSaga(unitSaga)
          .withReducer(reducer)
          .dispatch({ type: UnitActionTypes.UNIT_FETCH_REQUEST })
          .put.actionType(
            UnitActionTypes.UNIT_FETCH_ERROR
          )
          .silentRun(50)
      })
    })
    describe('retrieving all units', () => {
      const path = unitsResource

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
          .silentRun(50)

        const sagaPayload = lastSagaPutActionPayload(allEffects)
        expect(sagaPayload).toEqual(resource)
      })
    })

    describe('updating attributes of an existing unit', () => {
      const recordId = 1
      const path = `${unitsResource}/${recordId}`
      
      it('works', async () => {
        const fixtureUnit = (await getFixture(`/allUnits/4`)).data
        const { id, ...putBody } = fixtureUnit
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

      it("works through app saga", async () => {
        const successPayload = { result: "success!" }
        const formValues = { id: recordId, name: "foo", description: "bar", url: "baz" }
        const api: apiFn = (m, u, p, d, h) => {
          expect(m).toEqual('put');
          expect(p).toEqual(path);
          expect(d).toEqual(formValues);
          return Promise.resolve(successPayload);
        }
        await expectSaga(handleSaveUnit, api)
          .withState({ form: { editUnit: { values: formValues } } })
          .put({
            type: UnitActionTypes.UNIT_SAVE_SUCCESS,
            payload: successPayload,
            meta: undefined
          })
          .silentRun(50);
        });

      it("fails through app saga", async () => {
        const formValues = { id: recordId, name: "foo", description: "bar", url: "baz" }
        const api: apiFn = (m, u, p, d, h) =>
          Promise.resolve({errors: ["Error"]});

        await expectSaga(handleSaveUnit, api)
          .withState({ form: { editUnit: { values: formValues } } })
          .put({
            type: UnitActionTypes.UNIT_SAVE_ERROR,
            payload: ["Error"],
            meta: undefined
          })
          .silentRun(50);
      });
    })

    describe('creating a new unit', () => {
      const path = unitsResource

      it('works', async () => {
        const fixtureUnit = (await getFixture(`/allUnits/4`)).data
        const { id, ...postBody } = fixtureUnit
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
            status: 201,
            headers: { ...{ Location: Matchers.like(`${path}/1`) }, ...contentTypeHeader },
            body: Matchers.like(fixtureUnit)
          }
        })
        const pactResponseStatus = (await postPact(path, postBody)).status
        expect(pactResponseStatus).toEqual(201)
      })

      it("works through app saga", async () => {
        const successPayload = { result: "success!" }
        const formValues = { id: 0, name: "foo", description: "bar", url: "baz" }
        const api: apiFn = (m, u, p, d, h) => {
          expect(m).toEqual("post");
          expect(p).toEqual(path);
          expect(d).toEqual(formValues);
          return Promise.resolve(successPayload);
        }
        await expectSaga(handleSaveUnit, api)
          .withState({ form: { editUnit: { values: formValues } } })
          .put({
            type: UnitActionTypes.UNIT_SAVE_SUCCESS,
            payload: successPayload,
            meta: undefined
          })
          .silentRun(50);
      });

      it("fails through app saga", async () => {
        const formValues = { id: 0, name: "foo", description: "bar", url: "baz" }
        const api: apiFn = (m, u, p, d, h) =>
          Promise.resolve({ errors: ["Error"] });

        await expectSaga(handleSaveUnit, api)
          .withState({ form: { editUnit: { values: formValues } } })
          .put({
            type: UnitActionTypes.UNIT_SAVE_ERROR,
            payload: ["Error"],
            meta: undefined
          })
          .silentRun(50);
      });

    })

    describe('creating/updating a unit membership', () => {
      const path = "/units/4/members/1";
      // it('works', async () => {
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

      const formValues = { unitId: 4, id: 1, name: "gmichael", title: "Mr Manager", role: "Leader" }; 
      const state = { form: { addMemberForm: { values: formValues } } };

      it("works through app saga", async () => 
        await sagaApiHappyPath(handleSaveMember, state, "put", path, formValues, UnitActionTypes.UNIT_SAVE_MEMBER_SUCCESS)
      );

      it("fails through app saga", async () => 
        await sagaApiSadPath(handleSaveMember, state, UnitActionTypes.UNIT_SAVE_MEMBER_ERROR));

    })

    describe('deleting a unit', () => {

      const recordId = 1
      const path = `${unitsResource}/${recordId}`

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
  })
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

      it('works through app saga', async () => {
        const resource = (await getFixture(path)).data
        await expectSaga(profileSaga)
          .withState({ profile: { request: { id: recordId } } })
          .dispatch({ type: ProfileActionTypes.PROFILE_FETCH_REQUEST })
          .put({
            type: ProfileActionTypes.PROFILE_FETCH_SUCCESS,
            payload: resource,
            meta: undefined
          })
          .silentRun(50);
      })

      it('fails with bad id via saga', async () => {
        const reducer: Reducer = () =>
          ({
            profile: {
              request: { id: 100000 }
            }
          })

        await expectSaga(profileSaga)
          .withReducer(reducer)
          .dispatch({ type: ProfileActionTypes.PROFILE_FETCH_REQUEST })
          .put.actionType(
            ProfileActionTypes.PROFILE_FETCH_ERROR
          )
          .silentRun(50)
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
          .silentRun(50)

        const sagaPayload = lastSagaPutActionPayload(allEffects)
        expect(sagaPayload).toEqual(resource)
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
          .silentRun(50)

        const sagaPayload = lastSagaPutActionPayload(allEffects)
        expect(sagaPayload).toEqual(resource)
      })

      it('fails with bad id via saga', async () => {
        const reducer: Reducer = () =>
          ({
            department: {
              request: { id: 10000 }
            }
          })

        await expectSaga(departmentSaga)
          .withReducer(reducer)
          .dispatch({ type: DepartmentActionTypes.DEPARTMENT_FETCH_REQUEST })
          .put.actionType(
            DepartmentActionTypes.DEPARTMENT_FETCH_ERROR
          )
          .silentRun(50)

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
          .silentRun(50)

        const sagaPayload = lastSagaPutActionPayload(allEffects)
        expect(sagaPayload).toEqual(resource)
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
      .silentRun(50)

    const sagaPayload = lastSagaPutActionPayload(allEffects)
    expect(sagaPayload).toEqual(resource)
  })
})
