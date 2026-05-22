import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { isAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// ── Public endpoint: anyone can read branding settings ──
router.get('/branding', async (req, res) => {
  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'branding' } });
    if (setting?.value) {
      res.json(JSON.parse(setting.value));
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Get branding error:', error);
    res.json(null);
  }
});

// All remaining settings routes require admin authentication
router.use(isAdmin);

// GET all settings
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.settings.findMany();
    const settingsObj: Record<string, string> = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value || '';
    });
    res.json(settingsObj);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT update settings (batch)
router.put('/', async (req, res) => {
  try {
    const updates = req.body; // { key1: value1, key2: value2, ... }
    
    for (const [key, value] of Object.entries(updates)) {
      await prisma.settings.upsert({
        where: { key },
        update: { value: value as string, updated_at: new Date() },
        create: { key, value: value as string }
      });
    }

    res.json({ message: 'Đã lưu cấu hình' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET single setting by key
router.get('/:key', async (req, res) => {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: req.params.key }
    });
    res.json({ value: setting?.value || null });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

export default router;
