import 'cypress-testing-library/add-commands'
import './commands'
import * as effects from '../../src/components/effects'

// reset json-server db before each test

beforeEach(() => {
    cy.exec('git checkout src/db.json')
})
