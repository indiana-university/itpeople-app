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
  describe('for units', () => {

    const resource = jsondb.get('units')
      .find({ id: 1 })
      .value()

    const path = '/units/1'
    
    beforeAll(() => {
      return mockServer.addInteraction({
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
    })
    it('retrieves unit 1', async () => {
      const response = await axios.get(`${SERVER}${path}`)
      expect(response.data).toEqual(resource)
      mockServer.verify()
    })
  })
})
