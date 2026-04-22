import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

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
    const { email, password, name } = req.body;
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
    const { email, password } = req.body;
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });
    }
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });
    }
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

export default router;
