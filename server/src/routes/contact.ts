import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendContactNotification } from '../services/email';

const router = Router();
const prisma = new PrismaClient();

// POST /api/contact - Create new contact request
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    // Validation
    if (!name || !phone || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email không hợp lệ' 
      });
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Số điện thoại không hợp lệ' 
      });
    }

    // Create contact request
    const contactRequest = await prisma.contact_requests.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        status: 'pending'
      }
    });

    // Send email notification to admin (non-blocking)
    sendContactNotification(contactRequest).catch(err => {
      console.error('Failed to send email notification:', err);
      // Don't fail the request if email fails
    });

    res.status(201).json({
      success: true,
      message: 'Yêu cầu của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất!',
      data: {
        id: contactRequest.id,
        created_at: contactRequest.created_at
      }
    });

  } catch (error) {
    console.error('Error creating contact request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra. Vui lòng thử lại sau.' 
    });
  }
});

// GET /api/contact - Get all contact requests (Admin only)
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [contacts, total] = await Promise.all([
      prisma.contact_requests.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.contact_requests.count({ where })
    ]);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching contact requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra' 
    });
  }
});

// PATCH /api/contact/:id - Update contact request status (Admin only)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    updateData.updated_at = new Date();

    const updated = await prisma.contact_requests.update({
      where: { id: Number(id) },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Cập nhật thành công',
      data: updated
    });

  } catch (error) {
    console.error('Error updating contact request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra' 
    });
  }
});

// DELETE /api/contact/:id - Delete contact request (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.contact_requests.delete({
      where: { id: Number(id) }
    });

    res.json({
      success: true,
      message: 'Đã xóa yêu cầu liên hệ'
    });

  } catch (error) {
    console.error('Error deleting contact request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra' 
    });
  }
});

export default router;
