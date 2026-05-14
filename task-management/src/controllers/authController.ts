import type { Request, Response } from 'express';
import { createUser, findUserByEmail, validatePassword } from '../db/users';
import { generateToken } from '../middleware/auth';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      res.status(400).json({
        error: 'Username, email, and password are required'
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
      return;
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({
        error: 'User with this email already exists'
      });
      return;
    }

    // Create user
    const user = await createUser({ username, email, password });

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        error: 'Email and password are required'
      });
      return;
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({
        error: 'Invalid email or password'
      });
      return;
    }

    // Validate password
    const isValidPassword = await validatePassword(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({
        error: 'Invalid email or password'
      });
      return;
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}