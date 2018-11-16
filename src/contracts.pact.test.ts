/**
 * @jest-environment node
 */
import * as path from 'path'
import { Pact } from '@pact-foundation/pact'
import * as lowdb from 'lowdb'
import * as FileSync from 'lowdb/adapters/FileSync'
import axios from 'axios'

const lowdbAdapter = new FileSync('db.json')
const jsondb = lowdb(lowdbAdapter)

const PACT_PORT = 6123
const PACT_URL = `http://localhost:${PACT_PORT}`
const JSONDB_URL = 'http://localhost:3002'

const pactServer = new Pact({
  port: PACT_PORT,
  log: path.resolve(__dirname, '../contracts/pact-server.log'),
  dir: path.resolve(__dirname, '../contracts'),
  spec: 2,
  consumer: 'itpeople-app',
  provider: 'itpeople-functions'
})

const jsonGet = (path: String) => (axios.get(`${JSONDB_URL}${path}`))

beforeAll(() => pactServer.setup())
afterAll(() => pactServer.finalize())

describe('Contracts', () => {

  describe('for units', () => {

    it('retrieves unit 1', async () => {
      const path = '/units/1'
      const resource = (await jsonGet(path)).data
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
      const pactResponse = await axios.get(`${PACT_URL}${path}`)
      expect(pactResponse.data).toEqual(resource)
    })

    it('retrieves all units', async () => {
      const path = '/units'
      const resource = (await jsonGet(path)).data
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
      const response = await axios.get(`${PACT_URL}${path}`)
      expect(response.data).toEqual(resource)
    })

    describe('for profiles', () => {

      it('retrieves profile 1', async () => {
        const path = '/profiles/1'
        // the 'profiles' resource lives at /users
        const resource = (await jsonGet('/users/1')).data
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
        const response = await axios.get(`${PACT_URL}${path}`)
        expect(response.data).toEqual(resource)
      })
      
      it('retrieves all profiles', async () => {
        const path = '/profiles'
        // the 'profiles' resource lives at /users
        const resource = (await jsonGet('/users')).data
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
        const response = await axios.get(`${PACT_URL}${path}`)
        expect(response.data).toEqual(resource)
      })
    })

    describe('for departments', () => {

      it('retrieves department 1', async () => {
        const path = '/departments/1'
        const resource = (await jsonGet(path)).data
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
        const response = await axios.get(`${PACT_URL}${path}`)
        expect(response.data).toEqual(resource)
      })

      it('retrieves all departments', async () => {
        const path = '/departments'
        const resource = (await jsonGet(path)).data
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
        const response = await axios.get(`${PACT_URL}${path}`)
        expect(response.data).toEqual(resource)
      })
    })
  })
})
