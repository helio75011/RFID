import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { body, validationResult } from 'express-validator';

export class AuthController {
  static validateRegister = [
    body('email').isEmail().withMessage('Email invalide'),
    body('name').trim().isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
  ];

  static validateLogin = [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Mot de passe requis')
  ];

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, name, password, role } = req.body;
      const result = await AuthService.registerUser({ email, name, password, role });

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: {
          id: result.user._id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role
        },
        token: result.token
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;
      const result = await AuthService.loginUser(email, password);

      res.json({
        message: 'Connexion réussie',
        user: {
          id: result.user._id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role
        },
        token: result.token
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}