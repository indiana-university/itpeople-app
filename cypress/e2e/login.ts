
describe('user login', () => {
    it('should log in and out', () => {
        cy.visit('/')
        cy.getByText(/login/i).click()
        cy.queryByText(/login/i).should('not.exist')
        cy.getByText('johndoe').click()
        cy.getByText(/log out/i).click()
        cy.queryByText(/login/i).should('exist')
        })
})