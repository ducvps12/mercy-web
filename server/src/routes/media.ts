import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

const router = express.Router();

// Determine the public/products directory
const PUBLIC_DIR = path.resolve(__dirname, '../../../public');
const PRODUCTS_DIR = path.join(PUBLIC_DIR, 'products');

// Ensure directory exists
if (!fs.existsSync(PRODUCTS_DIR)) {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
}

// Admin middleware
const isAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.use(isAdmin);

// Helper: extract group/SKU prefix from filename
// e.g. "MCK5.0D-0.jpg" → "MCK5.0D", "RBnu-capy-2.jpg" → "RBnu-capy", "Bao-da-1.jpg" → "Bao-da"
function extractGroup(filename: string): string {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, ''); // strip extension
  // Match pattern: everything before the last dash followed by only digits
  const match = nameWithoutExt.match(/^(.+)-\d+$/);
  if (match) return match[1];
  return nameWithoutExt;
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, PRODUCTS_DIR);
  },
  filename: (_req, file, cb) => {
    // Preserve original filename but sanitize it
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext)
      .replace(/[^\w\d\s\-\.()ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềếểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/g, '')
      .replace(/\s+/g, '-');
    
    // Check for collision
    let finalName = `${base}${ext}`;
    let counter = 1;
    while (fs.existsSync(path.join(PRODUCTS_DIR, finalName))) {
      finalName = `${base}-${counter}${ext}`;
      counter++;
    }
    cb(null, finalName);
  },
});

// Shared regex for accepted media types
const IMAGE_EXTS = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
const VIDEO_EXTS = /\.(mp4|webm|mov|avi|mkv)$/i;
const MEDIA_EXTS = /\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov|avi|mkv)$/i;

function getFileType(filename: string): 'image' | 'video' {
  return VIDEO_EXTS.test(filename) ? 'video' : 'image';
}

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max (video support)
  fileFilter: (_req, file, cb) => {
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    if (MEDIA_EXTS.test(path.extname(originalName))) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận ảnh (jpg, png, gif, webp, svg) hoặc video (mp4, webm, mov, avi)'));
    }
  },
});

// ═══════════════════════════════════
// GET /api/media/list — List all media (images + videos)
// ═══════════════════════════════════
router.get('/list', (_req: any, res: any) => {
  try {
    if (!fs.existsSync(PRODUCTS_DIR)) {
      return res.json({ files: [], groups: [], stats: { totalFiles: 0, totalSize: 0 } });
    }

    const allFiles = fs.readdirSync(PRODUCTS_DIR)
      .filter(f => MEDIA_EXTS.test(f));

    let totalSize = 0;
    const files = allFiles.map(f => {
      const filePath = path.join(PRODUCTS_DIR, f);
      const stat = fs.statSync(filePath);
      totalSize += stat.size;
      return {
        filename: f,
        url: `/products/${f}`,
        size: stat.size,
        modified: stat.mtime,
        group: extractGroup(f),
        type: getFileType(f),
      };
    }).sort((a, b) => {
      // Sort by group then by filename
      if (a.group !== b.group) return a.group.localeCompare(b.group);
      return a.filename.localeCompare(b.filename);
    });

    // Extract unique groups
    const groupSet = new Set(files.map(f => f.group));
    const groups = Array.from(groupSet).sort();

    res.json({
      files,
      groups,
      stats: {
        totalFiles: files.length,
        totalSize,
      },
    });
  } catch (error) {
    console.error('Media list error:', error);
    res.status(500).json({ message: 'Lỗi liệt kê ảnh' });
  }
});

// ═══════════════════════════════════
// POST /api/media/upload — Upload media (images + videos)
// ═══════════════════════════════════
router.post('/upload', upload.array('images', 20), (req: any, res: any) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Không có file nào được tải lên' });
    }

    const uploaded = req.files.map((file: any) => ({
      filename: file.filename,
      url: `/products/${file.filename}`,
      size: file.size,
      type: getFileType(file.filename),
    }));

    res.json({
      message: `Đã tải lên ${uploaded.length} file`,
      files: uploaded,
    });
  } catch (error) {
    console.error('Media upload error:', error);
    res.status(500).json({ message: 'Lỗi tải ảnh lên' });
  }
});

// ═══════════════════════════════════
// PUT /api/media/rename — Rename a file
// ═══════════════════════════════════
router.put('/rename', (req: any, res: any) => {
  try {
    const { oldName, newName } = req.body;
    if (!oldName || !newName) {
      return res.status(400).json({ message: 'Thiếu tên file cũ hoặc mới' });
    }

    const oldPath = path.join(PRODUCTS_DIR, oldName);
    const newPath = path.join(PRODUCTS_DIR, newName);

    // Security: prevent path traversal
    if (!oldPath.startsWith(PRODUCTS_DIR) || !newPath.startsWith(PRODUCTS_DIR)) {
      return res.status(400).json({ message: 'Tên file không hợp lệ' });
    }

    if (!fs.existsSync(oldPath)) {
      return res.status(404).json({ message: 'File không tồn tại' });
    }

    if (fs.existsSync(newPath)) {
      return res.status(400).json({ message: 'File với tên mới đã tồn tại' });
    }

    fs.renameSync(oldPath, newPath);
    res.json({
      message: 'Đã đổi tên thành công',
      oldName,
      newName,
      url: `/products/${newName}`,
    });
  } catch (error) {
    console.error('Media rename error:', error);
    res.status(500).json({ message: 'Lỗi đổi tên file' });
  }
});

// ═══════════════════════════════════
// DELETE /api/media/delete/:filename — Delete a file
// ═══════════════════════════════════
router.delete('/delete/:filename', (req: any, res: any) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(PRODUCTS_DIR, filename);

    // Security: prevent path traversal
    if (!filePath.startsWith(PRODUCTS_DIR)) {
      return res.status(400).json({ message: 'Tên file không hợp lệ' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File không tồn tại' });
    }

    fs.unlinkSync(filePath);
    res.json({ message: 'Đã xóa ảnh', filename });
  } catch (error) {
    console.error('Media delete error:', error);
    res.status(500).json({ message: 'Lỗi xóa file' });
  }
});

// ═══════════════════════════════════
// POST /api/media/bulk-delete — Delete multiple files
// ═══════════════════════════════════
router.post('/bulk-delete', (req: any, res: any) => {
  try {
    const { filenames } = req.body;
    if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
      return res.status(400).json({ message: 'Danh sách file trống' });
    }

    let deleted = 0;
    let errors: string[] = [];

    for (const filename of filenames) {
      const filePath = path.join(PRODUCTS_DIR, filename);
      if (!filePath.startsWith(PRODUCTS_DIR)) {
        errors.push(`${filename}: tên không hợp lệ`);
        continue;
      }
      if (!fs.existsSync(filePath)) {
        errors.push(`${filename}: không tồn tại`);
        continue;
      }
      try {
        fs.unlinkSync(filePath);
        deleted++;
      } catch (e) {
        errors.push(`${filename}: lỗi xóa`);
      }
    }

    res.json({
      message: `Đã xóa ${deleted}/${filenames.length} ảnh`,
      deleted,
      errors,
    });
  } catch (error) {
    console.error('Media bulk delete error:', error);
    res.status(500).json({ message: 'Lỗi xóa file' });
  }
});

export default router;
