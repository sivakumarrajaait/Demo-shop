describe('Signup Page', () => {
    beforeEach(() => {
      cy.visit('/signup'); // Visit your signup route
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
  
    it('signs up with valid data', () => {
      cy.intercept('POST', '**/api/signup', {
        statusCode: 200,
        body: {
          result: {
            _id: 'mock-user-id',
            userName: 'mockUser',
            email: 'mock@example.com'
          },
          message: 'Signup Successful'
        }
      }).as('signupUser');
  
      cy.get('input[name="userName"]').type('John Doe');
      cy.get('input[name="mobile"]').type('1234567890');
      cy.get('input[name="email"]').type('john@example.com');
      cy.get('input[name="password"]').type('Sk@123456');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@signupUser');
  
      cy.contains('Signup Successful').should('exist');
  
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });
  });
  