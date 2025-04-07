import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User,UserDocument } from '../model/user.model';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
      const createUser: UserDocument = req.body;
  
      const userExists = await User.findOne({ email: createUser.email });
      if (userExists) {
         res.status(400).json({ result: null, message: 'User already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(createUser.password!, 10);
  
      createUser.password = hashedPassword;
  
      const newUser = new User(createUser);
  
      const finalResult = await newUser.save();
  
      res.status(201).json({ result: finalResult, message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ result: error, message: 'Server error' });
    }
  };
  

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({ isDeleted: false });
    res.json({ result: users, message: 'Users fetched successfully' });
  } catch (error) {
    res.status(500).json({ result: error, message: 'Server error' });
  }
};

export const getSingleUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.query._id);
    if (!user) {
      res.status(404).json({ result: null, message: 'User not found' });
      return;  
    }
    res.json({ result: user, message: 'User fetched successfully' });
  } catch (error) {
    res.status(500).json({ result: error, message: 'Server error' });
  }
};
