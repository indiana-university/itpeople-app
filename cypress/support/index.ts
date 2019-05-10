import 'cypress-testing-library/add-commands'
import './commands'

// reset json-server db before each test

beforeEach(() => {
    cy.exec('git co src/db.json')
})
