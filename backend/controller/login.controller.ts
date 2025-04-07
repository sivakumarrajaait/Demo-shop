import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { CreateJWTToken } from '../middleware/tokenManager';
import { User } from '../model/user.model';

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        if (typeof email !== 'string' || !validator.isEmail(email)) {
            throw new Error('Invalid email');
          }
          
          const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            res.status(400).json({ result: null, message: 'Invalid credentials' });
            return;
        }

        if (!user.password) {
            res.status(500).json({ result: null, message: 'User password is missing or invalid' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) {
            res.status(400).json({ result: null, message: 'Invalid credentials' });
            return;
        }

        const token = CreateJWTToken({
            id: user._id.toString(),
            email: user.email ?? ""
        });

        const details = {
            _id: user._id,
            email: user.email,
            userName: user.userName
        };

        const finalResult = {
            loginType: 'User',
            userDetails: details,
            token: token
        };

        res.status(200).json({ result: finalResult, message: 'User logged in successfully' });
    } catch (error) {
        res.status(500).json({ result: error, message: 'Server error' });
    }
};
