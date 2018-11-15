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

const unit1 = jsondb.get('units')
  .find({ id: 1 })
  .value()

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
    beforeAll(() => {
      return mockServer.addInteraction({
        state: 'unit 1 exists',
        uponReceiving: 'a GET request for unit 1',
        withRequest: {
          method: 'GET',
          path: '/unit/1'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: unit1
        }
      })
    })
    it('retrieves unit 1', async () => {
      const response = await axios.get(`${SERVER}/unit/1`)
      expect(response.data).toEqual(unit1)
      mockServer.verify()
    })
  })
})
