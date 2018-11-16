/**
 * @jest-environment node
 */
import * as path from 'path'
import { Pact } from '@pact-foundation/pact'
import axios from 'axios'

const PACT_PORT = 6123
const PACT_SERVER = `http://localhost:${PACT_PORT}`
const JSON_SERVER = 'http://localhost:3002'

const pactServer = new Pact({
  port: PACT_PORT,
  log: path.resolve(__dirname, '../contracts/pact-server.log'),
  dir: path.resolve(__dirname, '../contracts'),
  spec: 2,
  consumer: 'itpeople-app',
  provider: 'itpeople-functions'
})

const GET = (server: String, path: String) => (axios.get(`${server}${path}`))

const getFixture = (path: String) => (GET(JSON_SERVER, path))
const getPact = (path: String) => (GET(PACT_SERVER, path))

beforeAll(() => pactServer.setup())
afterAll(() => pactServer.finalize())

describe('Contracts', () => {

  describe('for units', () => {

    it('retrieves unit 1', async () => {
      const path = '/units/1'
      const resource = (await getFixture(path)).data
      expect(resource).not.toEqual({})
      await pactServer.addInteraction({
        state: 'unit 1 exists',
        uponReceiving: 'a GET request for unit 1',
        withRequest: {
          method: 'GET',
          path: path
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: resource
        }
      })
      const responseBody = (await getPact(path)).data
      expect(responseBody).toEqual(resource)
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
          path: path
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: resource
        }
      })
      const responseBody = (await getPact(path)).data
      expect(responseBody).toEqual(resource)
    })

    describe('for profiles', () => {

      it('retrieves profile 1', async () => {
        const path = '/profiles/1'
        // the 'profiles' resource lives at /users
        const resource = (await getFixture('/users/1')).data
        expect(resource).not.toEqual({})
        await pactServer.addInteraction({
          state: 'profile 1 exists',
          uponReceiving: 'a GET request for profile 1',
          withRequest: {
            method: 'GET',
            path: path
          },
          willRespondWith: {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: resource
          }
        })
        const responseBody = (await getPact(path)).data
        expect(responseBody).toEqual(resource)
      })

      it('retrieves all profiles', async () => {
        const path = '/profiles'
        // the 'profiles' resource lives at /users
        const resource = (await getFixture('/users')).data
        expect(resource).not.toEqual({})
        await pactServer.addInteraction({
          state: 'at least one profile exists',
          uponReceiving: 'a GET request to list profiles',
          withRequest: {
            method: 'GET',
            path: path
          },
          willRespondWith: {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: resource
          }
        })
        const responseBody = (await getPact(path)).data
        expect(responseBody).toEqual(resource)
      })
    })

    describe('for departments', () => {

      it('retrieves department 1', async () => {
        const path = '/departments/1'
        const resource = (await getFixture(path)).data
        expect(resource).not.toEqual({})
        await pactServer.addInteraction({
          state: 'department 1 exists',
          uponReceiving: 'a GET request for department 1',
          withRequest: {
            method: 'GET',
            path: path
          },
          willRespondWith: {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: resource
          }
        })
        const responseBody = (await getPact(path)).data
        expect(responseBody).toEqual(resource)
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
            path: path
          },
          willRespondWith: {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: resource
          }
        })
        const responseBody = (await getPact(path)).data
        expect(responseBody).toEqual(resource)
      })
    })

    describe('for searches', () => {

      it('searches without parameters', async () => {
        const path = '/search'
        const resource = (await getFixture(path)).data
        expect(resource).not.toEqual({})
        await pactServer.addInteraction({
          state: 'some data exists',
          uponReceiving: 'a GET request to search',
          withRequest: {
            method: 'GET',
            path: path
          },
          willRespondWith: {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: resource
          }
        })
        const responseBody = (await getPact(path)).data
        expect(responseBody).toEqual(resource)
      })
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
            method: 'GET',
            path: path
          },
          willRespondWith: {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: resource
          }
        })
        const responseBody = (await getPact(path)).data
        expect(responseBody).toEqual(resource)
      })
    })
  })
})
