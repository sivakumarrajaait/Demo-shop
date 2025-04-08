describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('shows required field errors when submitting empty form', () => {
      cy.get('button[type="submit"]').click();
      cy.contains('Email is required').should('exist');
      cy.contains('Password is required').should('exist');
    });
  
    it('shows invalid email error', () => {
      cy.get('input[name="email"]').type('invalidemail');
      cy.get('input[name="password"]').type('somepassword');
      cy.get('button[type="submit"]').click();
      cy.contains('Enter a valid email').should('exist');
    });
  
    it('fills form and submits with valid values', () => {
      cy.get('input[name="email"]').type('skkumar97260@gmail.com');
      cy.get('input[name="password"]').type('Sk@279200');
      cy.get('button[type="submit"]').click();
  
      cy.contains('Login Successful').should('exist'); 
      cy.url().should('include', '/product'); 
    });
  });
  