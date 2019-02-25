describe('LobbyPage', () => {
  it('should renders lobby', () => {
    cy.visit('/');
    cy.contains('.neko-welcome-message-dialog button', '閉じる').click();
    cy.contains('div', 'ねこ卓');
    cy.contains('div.headline', '卓01');
    cy.contains('div.headline', '卓02');
    cy.contains('div.headline', '卓03');
    cy.contains('span', 'ソードワールド2.0');
    cy.contains('span', 'クトゥルフ第7版');
  });

  it('should visit to room password page', () => {
    cy.visit('/');
    cy.contains('.neko-welcome-message-dialog button', '閉じる').click();
    cy.contains('button', '参加').click();
    cy.url().should('eq', 'http://localhost:8080/-room03');
  });

  it('should creates and visit new room', () => {
    cy.visit('/');
    cy.contains('.neko-welcome-message-dialog button', '閉じる').click();
    cy.contains('button', 'add').click();
    cy.get('input[aria-label="タイトル"]').type('卓04');
    cy.get('input[aria-label="ダイスの種類"]').type('ソードワールド2.0');
    cy.contains('.v-select-list div', 'ソードワールド2.0').click();
    cy.get('input[aria-label="キャラクター属性"]').type('HP,MP');
    cy.contains('button', '作成').click();
    cy.url().should('not', 'http://localhost:8080/');
    cy.contains('div', '卓04');
    cy.contains('span', 'ソードワールド2.0');
  });
});
