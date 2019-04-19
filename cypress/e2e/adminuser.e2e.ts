import { createYield } from "typescript";

describe('admin using the app', () => {

    it('creates new unit and deletes it', () => {
        cy.visit('/')
        cy.getByText(/log in/i).click()
        cy.getByText(/units/i).click()
        cy.getByText(/add new unit/i).click()
        cy.getByLabelText(/name/i).type('Test unit')
        cy.getByLabelText(/description/i).type('Test desc')
        cy.getByLabelText(/url/i).type('https://iu.edu')
        cy.getByText('Save').click()
        cy.getByText('Test unit').click()
        cy.getByTitle(/Delete:/).click()
        cy.queryByText('Test unit').should('not.exist')
    })
})