import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { JWT_SECRET } from '../config';

const router = express.Router();
const prisma = new PrismaClient();

// ═══ Avatar Upload Setup ═════════════════════════════════════════════
const AVATARS_DIR = path.resolve(__dirname, '../../../public/avatars');
if (!fs.existsSync(AVATARS_DIR)) {
  fs.mkdirSync(AVATARS_DIR, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, AVATARS_DIR),
  filename: (req: any, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `avatar-${req.userId}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận ảnh (jpg, png, gif, webp)'));
    }
  },
});

// ═══ Rate Limiter (in-memory) ═══════════════════════════════════════
interface RateEntry { count: number; firstAt: number; }
const registerLimiter = new Map<string, RateEntry>();
const loginLimiter = new Map<string, RateEntry>();

const REGISTER_LIMIT = 5;      // max 5 registrations per IP per hour
const REGISTER_WINDOW = 3600000; // 1 hour
const LOGIN_LIMIT = 10;         // max 10 login attempts per IP per 15 min
const LOGIN_WINDOW = 900000;    // 15 minutes

function getClientIP(req: any): string {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.ip ||
    'unknown'
  );
}

function checkRateLimit(
  map: Map<string, RateEntry>,
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const entry = map.get(key);
  if (!entry || now - entry.firstAt > windowMs) {
    map.set(key, { count: 1, firstAt: now });
    return true; // allowed
  }
  if (entry.count >= limit) return false; // blocked
  entry.count++;
  return true; // allowed
}

// Cleanup stale entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of registerLimiter) if (now - v.firstAt > REGISTER_WINDOW) registerLimiter.delete(k);
  for (const [k, v] of loginLimiter) if (now - v.firstAt > LOGIN_WINDOW) loginLimiter.delete(k);
}, 600000);

// ── JWT Auth Middleware ──────────────────────────────────────────────
function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Chưa đăng nhập' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
}

// ── Register ─────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    const ua = (req.headers['user-agent'] || '').substring(0, 500);

    // Rate limit check
    if (!checkRateLimit(registerLimiter, clientIP, REGISTER_LIMIT, REGISTER_WINDOW)) {
      return res.status(429).json({
        message: 'Quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau 1 giờ.',
      });
    }

    const { email, password, name } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email.split('@')[0] + '_' + Date.now();
    const user = await prisma.users.create({
      data: {
        email,
        username,
        full_name: name || '',
        password_hash: hashedPassword,
        role: 'customer',
        register_ip: clientIP,
        user_agent: ua,
        last_login_at: new Date(),
      },
    });
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, name: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: { id: user.id, name: user.full_name, email: user.email, role: user.role, phone: '', address: '', avatar: '' },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ── Login ────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    const ua = (req.headers['user-agent'] || '').substring(0, 500);

    // Rate limit check
    if (!checkRateLimit(loginLimiter, clientIP, LOGIN_LIMIT, LOGIN_WINDOW)) {
      return res.status(429).json({
        message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.',
      });
    }

    const { email, password } = req.body;
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });
    }
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });
    }

    // Update last login time and user agent
    await prisma.users.update({
      where: { id: user.id },
      data: { last_login_at: new Date(), user_agent: ua },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, name: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: {
        id: user.id, name: user.full_name, email: user.email, role: user.role,
        phone: user.phone || '', address: user.address || '', avatar: user.avatar || '',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ── Get My Profile ───────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.users.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    res.json({
      id: user.id,
      name: user.full_name || '',
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      avatar: user.avatar || '',
      role: user.role,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ── Update Profile ───────────────────────────────────────────────────
router.put('/profile', authMiddleware, async (req: any, res) => {
  try {
    const { name, phone, address, avatar } = req.body;
    const updated = await prisma.users.update({
      where: { id: req.userId },
      data: {
        full_name: name ?? undefined,
        phone: phone ?? undefined,
        address: address ?? undefined,
        avatar: avatar ?? undefined,
        updated_at: new Date(),
      },
    });
    res.json({
      message: 'Cập nhật thành công',
      user: {
        id: updated.id, name: updated.full_name, email: updated.email, role: updated.role,
        phone: updated.phone || '', address: updated.address || '', avatar: updated.avatar || '',
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ── Change Password ──────────────────────────────────────────────────
router.put('/change-password', authMiddleware, async (req: any, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }
    const user = await prisma.users.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { id: req.userId },
      data: { password_hash: hashedPassword, updated_at: new Date() },
    });
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ── Upload Avatar ────────────────────────────────────────────────────
router.post('/avatar', authMiddleware, (req: any, res: any, next: any) => {
  avatarUpload.single('avatar')(req, res, async (err: any) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Lỗi tải ảnh' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file ảnh' });
    }
    try {
      const avatarUrl = `/avatars/${req.file.filename}`;

      // Delete old avatar file if exists
      const user = await prisma.users.findUnique({ where: { id: req.userId } });
      if (user?.avatar && user.avatar.startsWith('/avatars/')) {
        const oldPath = path.join(AVATARS_DIR, path.basename(user.avatar));
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch {}
        }
      }

      // Update user avatar in DB
      const updated = await prisma.users.update({
        where: { id: req.userId },
        data: { avatar: avatarUrl, updated_at: new Date() },
      });

      res.json({
        message: 'Cập nhật ảnh đại diện thành công',
        avatar: avatarUrl,
        user: {
          id: updated.id, name: updated.full_name, email: updated.email, role: updated.role,
          phone: updated.phone || '', address: updated.address || '', avatar: updated.avatar || '',
        },
      });
    } catch (error) {
      console.error('Upload avatar error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  });
});

export default router;
