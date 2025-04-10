describe('Signup Page', () => {
    beforeEach(() => {
      cy.visit('/signup');
    });
  
    it('shows required field errors when submitting empty form', () => {
      cy.get('button[type="submit"]').click();
      cy.contains('Username is required').should('exist');
      cy.contains('Mobile number is required').should('exist');
      cy.contains('Email is required').should('exist');
      cy.contains('Password is required').should('exist');
    });
  
    it('shows invalid email error', () => {
      cy.get('input[name="userName"]').type('John Doe');
      cy.get('input[name="mobile"]').type('1234567890');
      cy.get('input[name="email"]').type('invalidemail');
      cy.get('input[name="password"]').type('somepassword');
      cy.get('button[type="submit"]').click();
      cy.contains('Enter a valid email').should('exist');
    });
  
    it('fills form and submits with valid values', () => {
      cy.get('input[name="userName"]').type('John Doe');
      cy.get('input[name="mobile"]').type('1234567890');
      cy.get('input[name="email"]').type('john@example.com');
      cy.get('input[name="password"]').type('Sk@123456');
      cy.get('button[type="submit"]').click();
  
      cy.contains('Signup Successful').should('exist'); 
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });
  });
  