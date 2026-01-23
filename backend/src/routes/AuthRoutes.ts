import { Router } from 'express';
import User from '../models/User';
import { CustomerModel } from '../models/CustomerModel';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

const router = Router();

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 🔴 BASIC VALIDATION
    if (!email || !password || !role) {
      return res.status(400).json({
        message: 'Email, password, and role are required'
      });
    }

    // 🔍 FIND USER BY EMAIL
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // 🔐 PASSWORD CHECK
    // ⚠️ IMPORTANT: `password` IS ALREADY SHA-256 HASH FROM FRONTEND
    // DB STORES bcrypt(sha256(password))
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // 🔴 ROLE CHECK (ADMIN / CUSTOMER)
    if (user.role !== role) {
      return res.status(403).json({
        message: 'You are not allowed to login from this portal'
      });
    }

    // 🚫 CUSTOMER SUSPENSION CHECK
    if (role === 'customer') {
      const customer = await CustomerModel.findOne({ email });

      if (!customer) {
        return res.status(403).json({
          message: 'Customer record not found'
        });
      }

      if (customer.status === 'SUSPENDED') {
        return res.status(403).json({
          message: 'Your account is suspended'
        });
      }
    }

    // ✅ GENERATE JWT TOKEN
    const token = jwt.sign(
      { id: user._id, role: user.role },
      'SECRET_KEY',
      { expiresIn: '5s' }
    );

    // 🎉 SUCCESS RESPONSE
    return res.json({
      token,
      role: user.role,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Server error during login'
    });
  }
});

export default router;
