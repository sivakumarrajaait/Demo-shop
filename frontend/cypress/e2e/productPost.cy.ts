describe('Product Post Page', () => {
    beforeEach(() => {
      cy.visit('/product/create'); 
    });
  
    it('shows validation errors on empty submit', () => {
      cy.get('button[type="submit"]').click();
  
      cy.contains('Product name is required').should('exist');
      cy.contains('Description is required').should('exist');
      cy.contains('Price is required').should('exist');
      cy.contains('Stock is required').should('exist');
      cy.contains('Image URL is required').should('exist');
    });
  
    it('fills and submits the form successfully', () => {
      cy.intercept('POST', '**/api/product', {
        statusCode: 200,
        body: {
          _id: 'mock-id',
          userId: 'mock-user-id',
          name: 'Test Product',
          description: 'This is a test product.',
          price: 100,
          stock: 10,
          image: 'https://example.com/mock-image.jpg',
        },
      }).as('createProduct');
  
     
      cy.get('input[name="name"]').type('Test Product');
      cy.get('textarea[name="description"]').type('This is a test product.');
      cy.get('input[name="price"]').clear().type('100');
      cy.get('input[name="stock"]').clear().type('10');
      cy.get('input[name="image"]').clear().type('https://example.com/mock-image.jpg');
  
     
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg', { force: true });
  
    
      cy.get('button[type="submit"]').click();
  
      cy.wait('@createProduct');
  
    
      cy.contains('Product created successfully').should('exist');
  
  
      cy.url().should('include', '/product');
    });
  });
  