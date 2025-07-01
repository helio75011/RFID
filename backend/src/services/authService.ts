import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { config } from '../config';

export class AuthService {
  static generateToken(userId: string): string {
    return jwt.sign({ userId }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
  }

  static async registerUser(userData: {
    email: string;
    name: string;
    password: string;
    role?: 'admin' | 'user';
  }): Promise<{ user: IUser; token: string }> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    const user = new User(userData);
    await user.save();

    const token = this.generateToken(user._id.toString());

    return { user, token };
  }

  static async loginUser(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = this.generateToken(user._id.toString());

    return { user, token };
  }
}