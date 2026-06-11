import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbRun, dbGet } from '../config/db.js';

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'supersecretkeyfortaskmanagementapp123';
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    secret,
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists (by email or username)
    const existingUser = await dbGet(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into DB
    const result = await dbRun(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    const newUser = {
      id: result.id,
      username,
      email
    };

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await dbGet(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, email]
    );

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const userProfile = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    const token = generateToken(userProfile);

    res.json({
      message: 'Login successful',
      token,
      user: userProfile
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await dbGet(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
};
