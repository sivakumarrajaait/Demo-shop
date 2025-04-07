describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/'); // Ensure dev server is running at localhost:5173
    });
  
    it('shows required field errors when submitting empty form', () => {
      cy.get('button[type="submit"]').click();
  
      cy.contains('Email is required').should('exist');
      cy.contains('Password is required').should('exist');
    });
  
    it('shows invalid email error', () => {
      cy.get('input[name="email"]').type('invalidemail'); // triggers invalid format
      cy.get('input[name="password"]').type('somepassword');
      cy.get('button[type="submit"]').click();
  
      cy.contains('Enter a valid email').should('exist');
    });
  
    it('logs in with correct credentials', () => {
      cy.intercept('POST', '**/api/login', {
        statusCode: 200,
        body: {
          result: {
            token: 'mock-token',
            loginType: 'User',
            userDetails: {
              _id: 'mock-user-id',
              userName: 'mockUser'
            }
          },
          message: 'Login Successful'
        }
      }).as('loginUser');
  
      cy.get('input[name="email"]').type('skkumar97260@gmail.com');
      cy.get('input[name="password"]').type('Sk@279200');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@loginUser');
  
      // Wait for toast (optional: add data-testid to toast for reliability)
      cy.contains('Login Successful').should('exist');
  
      // Confirm redirect
      cy.url().should('include', '/product');
    });
  });
  