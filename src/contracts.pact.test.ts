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

const PORT = 6123
const SERVER = `http://localhost:${PORT}`

const mockServer = new Pact({
  port: PORT,
  log: path.resolve(__dirname, '../contracts/pact-server.log'),
  dir: path.resolve(__dirname, '../contracts'),
  spec: 2,
  consumer: 'itpeople-app',
  provider: 'itpeople-functions'
})

beforeAll(() => mockServer.setup())
afterAll(() => mockServer.finalize())

describe('Contracts', () => {

  let resource = {}
  let path = ''

  describe('for units', () => {
    
    it('retrieves unit 1', async () => {
      resource = jsondb.get('units')
        .find({ id: 1 })
        .value() || {}
      expect(resource).not.toEqual({})
      path = '/units/1'
      await mockServer.addInteraction({
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
      const response = await axios.get(`${SERVER}${path}`)
      expect(response.data).toEqual(resource)
    })

    it('retrieves all units', async () => {
      resource = jsondb.get('units')
        .value() || {}
      expect(resource).not.toEqual({})
      path = '/units'
      await mockServer.addInteraction({
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
      const response = await axios.get(`${SERVER}${path}`)
      expect(response.data).toEqual(resource)
    })
    describe('for profiles', () => {

      it('retrieves profile 1', async () => {
        resource = jsondb.get('users')
          .find({ id: 1 })
          .value() || {}
        expect(resource).not.toEqual({})
        path = '/profiles/1'
        await mockServer.addInteraction({
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
        const response = await axios.get(`${SERVER}${path}`)
        expect(response.data).toEqual(resource)
      })

      it('retrieves all profiles', async () => {
        resource = jsondb.get('people')
          .value() || {}
        expect(resource).not.toEqual({})
        path = '/profiles'
        await mockServer.addInteraction({
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
        const response = await axios.get(`${SERVER}${path}`)
        expect(response.data).toEqual(resource)
      })
    })
  })
})
