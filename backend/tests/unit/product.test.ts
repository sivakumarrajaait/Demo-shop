import express, { Express } from 'express';
import request from 'supertest';
import { Product } from '../../model/product.model';
import {
  saveProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  filterProducts,
} from '../../controller/product.controller';


type MockProduct = {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  image?: string;
  status?: string;
  createdBy?: string;
  modifiedBy?: string;
};

jest.mock('../../model/product.model');
const mockedProduct = Product as jest.Mocked<typeof Product>;

const app: Express = express();
app.use(express.json());

app.post('/product', saveProduct);
app.get('/products', getAllProducts);
app.get('/product', getSingleProduct);
app.put('/product', updateProduct);
app.delete('/product', deleteProduct);
app.get('/products/filter', filterProducts);

describe('Product Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveProduct', () => {
    it('should save product successfully', async () => {
      mockedProduct.prototype.save.mockResolvedValueOnce({
        _id: '1',
        name: 'Test Product',
      } as MockProduct);

      const response = await request(app).post('/product').send({
        name: 'Test Product',
        description: 'A test product',
        price: 100,
        stock: 10,
        image: 'test.jpg',
        status: 'active',
        createdBy: 'admin',
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Product saved successfully');
    });

    it('should return 500 on save error', async () => {
      mockedProduct.prototype.save.mockRejectedValueOnce(new Error('DB error'));

      const response = await request(app).post('/product').send({
        name: 'Failing Product',
      });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error');
    });
  });

  describe('getAllProducts', () => {
    it('should fetch all products', async () => {
      mockedProduct.find.mockResolvedValueOnce([
        { _id: '1', name: 'P1' },
        { _id: '2', name: 'P2' },
      ] as MockProduct[]);

      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(response.body.result.length).toBe(2);
    });
  });

  describe('getSingleProduct', () => {
    it('should return one product by ID', async () => {
      mockedProduct.findById.mockResolvedValueOnce({
        _id: '1',
        name: 'Single',
      } as MockProduct);

      const response = await request(app).get('/product').query({ _id: '1' });
      expect(response.status).toBe(200);
      expect(response.body.result.name).toBe('Single');
    });

    it('should return 404 for missing product', async () => {
      mockedProduct.findById.mockResolvedValueOnce(null);

      const response = await request(app).get('/product').query({ _id: 'notfound' });
      expect(response.status).toBe(404);
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      mockedProduct.findByIdAndUpdate.mockResolvedValueOnce({
        _id: '1',
        name: 'Updated',
      } as MockProduct);

      const response = await request(app).put('/product').send({
        _id: '1',
        name: 'Updated',
        description: '',
        price: 0,
        stock: 0,
        image: '',
        status: '',
        modifiedBy: 'admin',
      });

      expect(response.status).toBe(200);
      expect(response.body.result.name).toBe('Updated');
    });

    it('should return 404 if product not found to update', async () => {
      mockedProduct.findByIdAndUpdate.mockResolvedValueOnce(null);

      const response = await request(app).put('/product').send({ _id: 'fake' });
      expect(response.status).toBe(404);
    });
  });

  describe('deleteProduct', () => {
    it('should soft delete a product', async () => {
      mockedProduct.findByIdAndUpdate.mockResolvedValueOnce({
        _id: '1',
      } as MockProduct);

      const response = await request(app).delete('/product').query({ _id: '1' });
      expect(response.status).toBe(200);
    });

    it('should return 404 if product not found to delete', async () => {
      mockedProduct.findByIdAndUpdate.mockResolvedValueOnce(null);

      const response = await request(app).delete('/product').query({ _id: 'notfound' });
      expect(response.status).toBe(404);
    });
  });

  describe('filterProducts', () => {
    it('should return filtered products by name', async () => {
      mockedProduct.find.mockResolvedValueOnce([
        {
          _id: '3',
          name: 'FilterTest',
        },
      ] as MockProduct[]);

      const response = await request(app).get('/products/filter').query({ name: 'Filter' });
      expect(response.status).toBe(200);
      expect(response.body.result.length).toBeGreaterThan(0);
    });

    it('should return 400 if no filter is provided', async () => {
      const response = await request(app).get('/products/filter');
      expect(response.status).toBe(400);
    });
  });
});
