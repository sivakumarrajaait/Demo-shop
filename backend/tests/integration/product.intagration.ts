import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {app} from '../../App'; 
import { Product } from '../../model/product.model';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Product.deleteMany({});
});

describe('Product API Integration Tests', () => {
  it('should create a new product', async () => {
    const productData = {
      userId: new mongoose.Types.ObjectId(),
      name: 'Test Product',
      description: 'A test product',
      price: 100,
      stock: 10,
      image: 'test.jpg',
    };

    const response = await request(app)
      .post('/api/product')
      .auth('yourBasicAuthUser', 'yourPassword') // replace with actual or mock middleware
      .send(productData);

    expect(response.status).toBe(201);
    expect(response.body.result.name).toBe('Test Product');
  });

  it('should get all products', async () => {
    await Product.create({
      userId: new mongoose.Types.ObjectId(),
      name: 'Product 1',
      description: 'Test Desc',
      price: 50,
      stock: 5,
      image: 'img.png',
    });

    const response = await request(app)
      .get('/api/product')
      .auth('yourBasicAuthUser', 'yourPassword');

    expect(response.status).toBe(200);
    expect(response.body.result.length).toBe(1);
  });

  it('should get single product by ID', async () => {
    const product = await Product.create({
      userId: new mongoose.Types.ObjectId(),
      name: 'Product One',
      description: 'Testing one',
      price: 20,
      stock: 3,
      image: 'one.png',
    });

    const response = await request(app)
      .get('/api/product/singleProduct')
      .query({ _id: product._id })
      .auth('yourBasicAuthUser', 'yourPassword');

    expect(response.status).toBe(200);
    expect(response.body.result._id).toBe(product._id.toString());
  });

  it('should update a product', async () => {
    const product = await Product.create({
      userId: new mongoose.Types.ObjectId(),
      name: 'Old Name',
      description: 'Old',
      price: 10,
      stock: 2,
      image: 'old.png',
    });

    const response = await request(app)
      .put('/api/product')
      .auth('yourBasicAuthUser', 'yourPassword')
      .send({
        _id: product._id,
        name: 'Updated Name',
        description: 'Updated',
        price: 15,
        stock: 5,
        image: 'new.png',
        modifiedBy: 'test-user'
      });

    expect(response.status).toBe(200);
    expect(response.body.result.name).toBe('Updated Name');
  });

  it('should soft delete a product', async () => {
    const product = await Product.create({
      userId: new mongoose.Types.ObjectId(),
      name: 'To Delete',
      description: 'Will be deleted',
      price: 5,
      stock: 1,
      image: 'del.png',
    });

    const response = await request(app)
      .delete('/api/product')
      .query({ _id: product._id })
      .auth('yourBasicAuthUser', 'yourPassword');

    expect(response.status).toBe(200);

    const deletedProduct = await Product.findById(product._id);
    expect(deletedProduct?.isDeleted).toBe(true);
  });
});
