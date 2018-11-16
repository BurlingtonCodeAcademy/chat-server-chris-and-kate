describe("page loading", ()=>{
  it ("shows user interface", () =>{
    cy.visit("/")
  cy.get("#main-room")
  cy.get("#room-list")
  cy.get("#user-input")
  cy.get("input[name=user]")
  cy.get("input[name=message]")
  })
})