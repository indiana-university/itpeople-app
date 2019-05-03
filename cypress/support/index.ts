import 'cypress-testing-library/add-commands'
import './commands'

beforeEach(() => {
    cy.exec('git co src/db.json')
})
