import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
const bad = (res, message, code = 400) => res.status(code).json({ message });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || name.trim().length < 2) return bad(res, 'Enter your full name');
    if (!/^\S+@\S+\.\S+$/.test(email || '')) return bad(res, 'Enter a valid email address');
    if (!/^\d{10}$/.test(phone || '')) return bad(res, 'Phone number must be 10 digits');
    if (!password || password.length < 6) return bad(res, 'Password must be at least 6 characters');
    if (await User.findOne({ email: email.toLowerCase() })) return bad(res, 'This email is already registered', 409);
    const user = await User.create({ name, email, phone, password: await bcrypt.hash(password, 10) });
    const { password: _, ...safe } = user.toObject();
    res.status(201).json({ token: sign(user._id), user: safe });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return bad(res, 'Enter your email and password');
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) return bad(res, 'Incorrect email or password', 401);
    const { password: _, ...safe } = user.toObject();
    res.json({ token: sign(user._id), user: safe });
  } catch (e) { next(e); }
});

router.get('/me', auth, async (req, res, next) => {
  try { res.json(await User.findById(req.userId)); } catch (e) { next(e); }
});

router.put('/me', auth, upload.single('avatar'), async (req, res, next) => {
  try {
    const { name, phone, age, gender, address } = req.body;
    if (phone && !/^\d{10}$/.test(phone)) return bad(res, 'Phone number must be 10 digits');
    const update = { name, phone, age, gender, address };
    Object.keys(update).forEach((k) => (update[k] === undefined || update[k] === '') && k !== 'address' && k !== 'gender' && delete update[k]);
    if (req.file) update.avatar = `/uploads/${req.file.filename}`;
    res.json(await User.findByIdAndUpdate(req.userId, update, { new: true, runValidators: true }));
  } catch (e) { next(e); }
});

export default router;
