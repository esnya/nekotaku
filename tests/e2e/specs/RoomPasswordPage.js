describe('RoomPasswordPage', () => {
  it('should renders page', () => {
    cy.visit('/-room01');
    cy.contains('button', '閉じる').click();
    cy.contains('div', 'パスワード入力');
    cy.contains('button', '参加');
    cy.contains('button', 'やめる');
  });

  it('should returns lobby by clicking やめる button', () => {
    cy.visit('/-room01');
    cy.contains('button', '閉じる').click();
    cy.contains('button', 'やめる').click();
    cy.url().should('eq', 'http://localhost:8080/');
  });

  it('should not joins room without password', () => {
    cy.visit('/-room01');
    cy.contains('button', '閉じる').click();
    cy.contains('button', '参加').click();
    cy.url().should('eq', 'http://localhost:8080/-room01/password');
  });

  it('should not joins room with invalid password', () => {
    cy.visit('/-room01');
    cy.contains('button', '閉じる').click();
    cy.get('input[type="password"]').type('passssssss');
    cy.contains('button', '参加').click();
    cy.url().should('eq', 'http://localhost:8080/-room01/password');
  });

  it('should joins room with valid password', () => {
    cy.visit('/-room01');
    cy.contains('button', '閉じる').click();
    cy.get('input[type="password"]').type('pass');
    cy.contains('button', '参加').click();
    cy.url().should('eq', 'http://localhost:8080/-room01/chat');
  });
});
