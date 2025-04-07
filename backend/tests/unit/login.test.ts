import request from 'supertest';
import express, { Express } from 'express';
import { login } from '../../controller/login.controller'; 
import * as tokenManager from '../../middleware/tokenManager';
import { User } from '../../model/user.model';
import bcrypt from 'bcryptjs';


const app: Express = express();
app.use(express.json());
app.post('/login', login);


jest.mock('../../model/user.model', () => ({
  User: {
    findOne: jest.fn()
  }
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn()
}));

jest.mock('../../middleware/tokenManager', () => ({
  CreateJWTToken: jest.fn()
}));

describe('Login Controller', () => {
  const mockUser = {
    _id: '123',
    email: 'test@example.com',
    userName: 'TestUser',
    password: 'hashedpassword'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully with valid credentials', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (tokenManager.CreateJWTToken as jest.Mock).mockReturnValue('mockedToken');

    const response = await request(app).post('/login').send({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(response.status).toBe(200);
    expect(response.body.result.token).toBe('mockedToken');
    expect(response.body.result.userDetails.email).toBe('test@example.com');
    expect(response.body.message).toBe('User logged in successfully');
  });

  it('should return 400 for invalid email format', async () => {
    const response = await request(app).post('/login').send({
      email: 'invalid-email',
      password: 'password123'
    });

    expect(response.status).toBe(500); 
    expect(response.body.message).toBe('Server error');
  });

  it('should return 400 for incorrect password', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const response = await request(app).post('/login').send({
      email: 'test@example.com',
      password: 'wrongpassword'
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return 400 if user not found', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const response = await request(app).post('/login').send({
      email: 'notfound@example.com',
      password: 'password123'
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return 500 if user password is missing', async () => {
    const userWithNoPassword = { ...mockUser, password: undefined };
    (User.findOne as jest.Mock).mockResolvedValue(userWithNoPassword);

    const response = await request(app).post('/login').send({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('User password is missing or invalid');
  });
});
