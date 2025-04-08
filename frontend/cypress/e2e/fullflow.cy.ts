describe('End-to-End Product Flow', () => {
    const uniqueEmail = 'sk@gmail.com'; // You can replace this with dynamic email using template string if needed
    const password = 'Sk@279200';
    let productName = 'Test Product';
    let updatedProductName = 'Updated Product';
    it('Signs up a new user', () => {
      cy.visit('/signup');
  
      cy.get('input[name="userName"]').type('Test User');
      cy.get('input[name="mobile"]').type('6383669620');
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();
  
      cy.contains(/signup successful/i).should('exist');
      cy.url().should('include', '/');
    });
  
    it('Logs in with the new user', () => {
      cy.visit('/'); 
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();
  
      cy.contains(/login successful/i).should('exist');
      cy.url().should('include', '/product'); 
    });
    it('click button to add product', () => {
        cy.visit('/'); 
        cy.get('input[name="email"]').type(uniqueEmail);
        cy.get('input[name="password"]').type(password);
        cy.get('button[type="submit"]').click();
    
        cy.contains(/login successful/i).should('exist');
        cy.url().should('include', '/product'); 
      });
    it('Posts a new product', () => {
  
      cy.get('button[type="submit"]').click();
  
      cy.contains(/product created successfully/i).should('exist');
      cy.url().should('include', '/product/');
      cy.contains(productName).should('exist');
    });
  
    it('Edits the created product', () => {
      cy.contains(productName).parents('[data-testid="product-card"]').within(() => {
        cy.contains('Edit').click();
      });
  
      cy.get('input[name="title"]').clear().type(updatedProductName);
      cy.get('button[type="submit"]').click();
  
      cy.contains(/product updated successfully/i).should('exist');
      cy.contains(updatedProductName).should('exist');
    });
  
    it('Deletes the product', () => {
      cy.contains(updatedProductName).parents('[data-testid="product-card"]').within(() => {
        cy.contains('Delete').click();
      });
  
      cy.contains(/product deleted successfully/i).should('exist');
      cy.contains(updatedProductName).should('not.exist');
    });
  });
  