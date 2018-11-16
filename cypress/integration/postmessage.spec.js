describe("posting message", ()=>{
  it ("posts message that is typed", () =>{
    cy.get ("input[name=user]")
      .type('Christopher')
    cy.get("input[name=message]")
      .type('My first message')
    cy.get("#user-input button[type=submit]")
      .click()
    cy.get("#main-room")
      .contains('My first message')
      



  })
})