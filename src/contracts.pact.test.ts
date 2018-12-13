/**
 * @jest-environment node
 */
import * as path from 'path'
import { Pact, Matchers } from '@pact-foundation/pact'
import axios from 'axios'
import * as traverse from 'traverse'
import { expectSaga } from 'redux-saga-test-plan'
import { ProfileActionTypes, saga as profileSaga } from './components/Profile/store'
import { UnitActionTypes, saga as unitSaga } from './components/Unit/store'
import { DepartmentActionTypes, saga as departmentSaga } from './components/Department/store'
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
const GET = (server: String, path: String) => (axios.get(`${server}${path}`, { headers: authHeader }))

const getFixture = (path: String) => (GET(JSON_SERVER, path))
const getPact = (path: String) => (GET(PACT_SERVER, path))

beforeAll(() => pactServer.setup())
afterAll(() => pactServer.finalize())

describe('Contracts', () => {

  describe('for units', () => {

    it('requires authentication to view a unit', async () => {
      const path = '/units/401'
      await pactServer.addInteraction({
        state: 'the server requires authorization',
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
      return expect(axios.get(`${PACT_SERVER}${path}`)).rejects.toEqual(
        new Error('Request failed with status code 401'))
    })

    it('retrieves a unit', async () => {
      const recordId = 1
      const path = `/units/${recordId}`
      const resource = (await getFixture(path)).data
      expect(resource).not.toEqual({})
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
          headers: {
            'Content-Type': 'application/json'
          },
          body: deepMatchify(resource)
        }
      })
      const pactResponseBody = (await getPact(path)).data
      expect(pactResponseBody).not.toEqual({})

      const reducer: Reducer = () => {
        return {
          unit: {
            request: { id: recordId }
          }
        }
      }
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

    it('retrieves all units', async () => {
      const path = '/units'
      const resource = (await getFixture(path)).data
      expect(resource).not.toEqual({})
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
          headers: {
            'Content-Type': 'application/json'
          },
          body: deepMatchify(resource)
        }
      })

      const reducer: Reducer = () => {
        return {
          unit: {
            request: { id: '' }
          }
        }
      }
      const { allEffects } = await expectSaga(unitSaga)
        .withReducer(reducer)
        .dispatch({ type: UnitActionTypes.UNIT_FETCH_REQUEST })
        .put.actionType(
          UnitActionTypes.UNIT_FETCH_SUCCESS
        )
        .run()

      const sagaPayload = lastSagaPutActionPayload(allEffects)
      expect(sagaPayload).toEqual(resource)

      const pactResponseBody = (await getPact(path)).data
      expect(pactResponseBody).not.toEqual({})
    })

    describe('for profiles', () => {

      it('retrieves profile 1', async () => {
        const recordId = 1
        const path = `/people/${recordId}`
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
            headers: {
              'Content-Type': 'application/json'
            },
            body: deepMatchify(resource)
          }
        })
        const pactResponseBody = (await getPact(path)).data
        expect(pactResponseBody).not.toEqual({})

        const reducer: Reducer = () => {
          return {
            profile: {
              request: { id: recordId }
            }
          }
        }
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

      describe('for the user', () => {

        it('retrieves your profile', async () => {

          const path = '/me'

          const resource = (await getFixture(path)).data
          expect(resource).not.toEqual({})
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
              headers: {
                'Content-Type': 'application/json'
              },
              body: deepMatchify(resource)
            }
          })
          const pactResponseBody = (await getPact(path)).data
          expect(pactResponseBody).not.toEqual({})
        const reducer: Reducer = () => {
          return {
            profile: {
              request: { id: 0 }
            }
          }
        }
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

      it('retrieves department 1', async () => {
        const recordId = 1
        const path = `/departments/${recordId}`
        const resource = (await getFixture(path)).data
        expect(resource).not.toEqual({})
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
            headers: {
              'Content-Type': 'application/json'
            },
            body: deepMatchify(resource)
          }
        })
        const pactResponseBody = (await getPact(path)).data
        expect(pactResponseBody).not.toEqual({})

        const reducer: Reducer = () => {
          return {
            department: {
              request: { id: recordId }
            }
          }
        }
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

      it('retrieves all departments', async () => {
        const path = '/departments'
        const resource = (await getFixture(path)).data
        expect(resource).not.toEqual({})
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
            headers: {
              'Content-Type': 'application/json'
            },
            body: deepMatchify(resource)
          }
        })
        const pactResponseBody = (await getPact(path)).data
        expect(pactResponseBody).not.toEqual({})

        const reducer: Reducer = () => {
          return {
            department: {
              request: { id: '' }
            }
          }
        }
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

    describe('for searches', () => {

      it('searches for "park"', async () => {
        const path = '/search'
        const resource = (await getFixture(path)).data
        expect(resource).not.toEqual({})
        await pactServer.addInteraction({
          state: 'data exists to be returned by term',
          uponReceiving: 'a GET request to search with a term',
          withRequest: {
            method: 'GET',
            headers: authHeader,
            path: path,
            query: {
              term: "park"
            }
          },
          willRespondWith: {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: deepMatchify(resource)
          }
        })
        const pactResponseBody = (await getPact(path + "?term=park")).data
        expect(pactResponseBody).not.toEqual({})
      })
    })

  })
})
