import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get reviews for a specific product
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const limit = Number(req.query.limit) || 10;
    
    const reviews = await prisma.product_reviews.findMany({
      where: { product_id: productId, is_active: true },
      orderBy: { sort_order: 'desc' },
      take: limit
    });
    
    const mapped = reviews.map(r => ({
      id: r.id,
      name: r.reviewer_name,
      avatarLetter: r.avatar_letter || r.reviewer_name.charAt(0),
      avatarColor: r.avatar_color || 'bg-red-500',
      rating: r.rating,
      date: r.review_date,
      verified: r.is_verified,
      text: r.review_text,
      helpful: r.helpful_count || 0,
      imageUrl: r.image_url || undefined
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Fetch reviews error:', error);
    res.status(500).json([]);
  }
});

// Post a review
router.post('/', async (req, res) => {
  try {
    const { productId, name, rating, text, image_url } = req.body;
    
    if (!productId || !name || !rating || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const review = await prisma.product_reviews.create({
      data: {
        product_id: productId,
        reviewer_name: name,
        avatar_letter: name.charAt(0).toUpperCase(),
        rating: Number(rating),
        review_date: new Date().toLocaleDateString('vi-VN'),
        review_text: text,
        image_url: image_url || "",
        is_verified: false,
        is_active: true
      }
    });

    res.json({ success: true, id: review.id });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Cannot add review' });
  }
});

export default router;
