import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

export const validateRegister = [
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['patient', 'doctor', 'admin'])
];

export async function register(req, res) {
  const { name, email, password, role = 'patient' } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });
  await AuditLog.create({ userId: user._id, action: 'register', ip: req.ip });
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
}

export const validateLogin = [
  body('email').isEmail(),
  body('password').isString()
];

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  await AuditLog.create({ userId: user._id, action: 'login', ip: req.ip });
  res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).select('-passwordHash');
  res.json(user);
}

export async function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
}
