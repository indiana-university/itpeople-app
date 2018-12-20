/**
 * @jest-environment node
 */

/**
* Copyright (C) 2018 The Trustees of Indiana University
* SPDX-License-Identifier: BSD-3-Clause
*/

import * as path from 'path'
import { Pact, Matchers, Verifier } from '@pact-foundation/pact'
import axios from 'axios'

// Verify that the provider meets all consumer expectations
describe('Pact Verification', () => {
  it('should validate the expectations of Matching Service', async () => {

    let opts = {
      provider: 'itpeople-functions',
      providerBaseUrl: 'http://localhost:3001',
      // providerStatesSetupUrl: 'http://localhost:3001/',
      // Fetch pacts from broker
      // pactBrokerUrl: 'https://test.pact.dius.com.au/',
      // Fetch from broker with given tags
      // tags: ['prod', 'sit5'],
      // Specific Remote pacts (doesn't need to be a broker)
      // pactFilesOrDirs: ['https://test.pact.dius.com.au/pacts/provider/Animal%20Profile%20Service/consumer/Matching%20Service/latest'],
      // Local pacts
      pactUrls: [path.resolve(__dirname, '../contracts/itpeople-app-itpeople-functions.json')],
      providerVersion: "2.0.0",
      // customProviderHeaders: ['Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOiIxOTE1NTQ0NjQzIiwidXNlcl9pZCI6IjEiLCJ1c2VyX25hbWUiOiJqb2huZG9lIn0.9uerDlhPKrtBrMMHuRoxbJ5x0QA7KOulDEHx9DKXpnQ']
    }

    let output = await new Verifier().verifyProvider(opts)

    console.log('Pact Verification Complete!')
    console.log(output)
  })
})