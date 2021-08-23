const clearSessionStorage = (win: any) =>
    win.sessionStorage.clear();
    
    describe('admin user', () => {
        it('creates new unit and deletes it', () => {
        cy.viewport(1280, 800)
        cy.visit('/', { onBeforeLoad: clearSessionStorage })
        cy.getAllByText(/log in/i).last().click()
        cy.get('header.rvt-header a[href="/units"]').first().click()
        cy.getAllByText(/add new unit/i).first().click()
        cy.getByLabelText(/name/i).type('Test unit')
        cy.getByLabelText(/description/i).type('Test desc')
        cy.getByLabelText(/url/i).type('https://iu.edu')
        cy.getByText('Save').click()
        cy.get("[href='/units/8']").as('testUnit').click()
        cy.getByTitle(/Delete:/).click()
        cy.getByText(/parks and recreation it/i).should("exist") // units page reloaded
        cy.get('@testUnit').should('not.be.visible')
    })
    
    it('adds unit member & tool -> removes them', () => {
        cy.visit('/', { onBeforeLoad: clearSessionStorage })
        cy.getAllByText(/log in/i).last().click()
        cy.visit('/units/2')
        cy.getByTitle(/edit/i).click()
        cy.getByTitle(/add leader/i).click()
        cy.getAllByLabelText(/search/i).first().type('sebastian')
        cy.getAllByText(/sebastian/i).first().click()
        cy.getAllByText(/submit addition/i).first().click()
        cy.getAllByText(/sebastian/i).first().should("exist")
        cy.queryByTitle(/edit tools/i).click()
        cy.getByLabelText(/survey/i).check({ force: true })
        cy.getByText(/update/i).click()
        cy.wait(150) // wait to give list time to populate
        cy.queryByTitle(/edit tools/i).click()
        cy.getByLabelText(/survey/i).should("be.checked")
        cy.getByLabelText(/survey/i).uncheck({ force: true })
        cy.getByText(/update/i).click()
        cy.wait(250)
        cy.queryByTitle(/edit tools/i).click()
        cy.getByLabelText(/survey/i).should("exist")
        cy.getByLabelText(/survey/i).should("not.be.checked")
        cy.getByText(/update/i).click()
        cy.getByTitle(/remove member/i).click()
        cy.queryByText(/sebastian/i).should("not.exist")
    })
})

describe('standard user', () => {
    
    it('cannot edit or delete a unit', () => {
        cy.visit('/', { onBeforeLoad: clearSessionStorage })
        cy.getAllByText(/log in/i).last().click()
        cy.visit('/units/1')
        cy.queryByTitle(/edit:/i).should("not.be.visible")
        cy.queryByTitle(/delete:/i).should("not.be.visible")
    })
})

describe('unit leader', () => {

    it('can edit unit, members & tools', () => {
        cy.visit('/', { onBeforeLoad: clearSessionStorage })
        cy.getAllByText(/log in/i).last().click()
        cy.visit('/units/4')
        cy.queryByTitle(/delete:/i).should("not.be.visible")
        cy.getByTitle(/edit:/i).click()
        cy.getByTitle(/add leader/i).should("be.visible")
        cy.getByTitle(/add members/i).should("be.visible")
        cy.getByTitle(/add others/i).should("be.visible")
        cy.getAllByTitle(/edit tools/i).first().should("be.visible")
    })
})