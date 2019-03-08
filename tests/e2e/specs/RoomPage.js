describe('RoomPage', () => {
  it('should renders page', () => {
    cy.visit('/-room02');
    cy.contains('.neko-welcome-message-dialog button', '閉じる').click();
    cy.contains('div', '卓02');
    cy.contains('div', 'ソードワールド2.0');
  });

  it('should sends new message', () => {
    cy.contains('.neko-room-bottom-nav a', 'チャット').click();
    cy.get('.neko-bottom-toolbar textarea').type('Test Message With Cypress');
    cy.contains('.neko-bottom-toolbar i', 'send').click();
    cy.contains('.v-card div', 'Test Message With Cypress');
  });

  it('should creates new character', () => {
    cy.contains('.neko-room-bottom-nav a', 'キャラクター').click();
    cy.contains('.neko-charcter-tab button', 'add').click();
    cy.get('input[aria-label="キャラクター名"]').first().type('でいびっど');
    cy.get('input[aria-label="HP"]').first().type('10/10');
    cy.get('input[aria-label="MP"]').first().type('5/5');
    cy.contains('button', '追加').click();
    cy.contains('td', 'でいびっど');
    cy.contains('td', '10/10');
    cy.contains('td', '5/5');
  });

  it('should deletes character', () => {
    cy.contains('tr', 'でいびっど').contains('button', 'edit').click();
    cy.contains('.v-dialog', 'でいびっど').contains('a', 'delete').click();
    cy.contains('.v-dialog', 'でいびっど').contains('button', '消去').click();
  });
});
