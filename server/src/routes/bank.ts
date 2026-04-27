import express from 'express';
import axios from 'axios';
import { ACB_HISTORY_API_URL } from '../config';

const router = express.Router();

router.get('/history', async (_req, res) => {
  try {
    if (!ACB_HISTORY_API_URL) {
      return res.status(500).json({ message: 'Chưa cấu hình ACB_HISTORY_API_URL' });
    }

    const response = await axios.get(ACB_HISTORY_API_URL);
    res.json(response.data);
  } catch (error) {
    console.error('Bank history error:', error);
    res.status(500).json({ message: 'Không thể tải lịch sử giao dịch ngân hàng' });
  }
});

export default router;
