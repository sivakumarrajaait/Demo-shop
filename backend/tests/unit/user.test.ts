import express from 'express';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { register, getAllUsers, getSingleUser } from '../../controller/user.controller';
import { User, UserDocument } from '../../model/user.model';

jest.mock('../../model/user.model');
jest.mock('bcryptjs');

const app = express();
app.use(express.json());
app.post('/register', register);
app.get('/users', getAllUsers);
app.get('/user', getSingleUser);

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    const mockUserInstance: Partial<UserDocument> & { save: jest.Mock } = {
      email: 'test@example.com',
      userName: 'John Doe',
      password: 'hashedPassword',
      save: jest.fn().mockResolvedValue({
        _id: 'user123',
        email: 'test@example.com',
        userName: 'John Doe',
        password: 'hashedPassword',
      }),
    };

  
    (User as unknown as jest.Mock).mockImplementation(() => mockUserInstance);

    const res = await request(app).post('/register').send({
      email: 'test@example.com',
      userName: 'John Doe',
      password: '123456',
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });


  describe('getAllUsers', () => {
    it('should fetch all users', async () => {
      (User.find as jest.Mock).mockResolvedValue([
        { _id: '1', name: 'Alice', email: 'alice@example.com' },
      ]);

      const res = await request(app).get('/users');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Users fetched successfully');
      expect(res.body.result).toHaveLength(1);
    });

    it('should return 500 on error', async () => {
      (User.find as jest.Mock).mockRejectedValue(new Error('Find error'));

      const res = await request(app).get('/users');

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Server error');
    });
  });

  describe('getSingleUser', () => {
    it('should fetch a user by ID', async () => {
      (User.findById as jest.Mock).mockResolvedValue({
        _id: '1',
        name: 'Alice',
        email: 'alice@example.com',
      });

      const res = await request(app).get('/user').query({ _id: '1' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User fetched successfully');
    });

    it('should return 404 if user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/user').query({ _id: 'unknown' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return 500 on error', async () => {
      (User.findById as jest.Mock).mockRejectedValue(new Error('Find error'));

      const res = await request(app).get('/user').query({ _id: 'error' });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Server error');
    });
  });
});
