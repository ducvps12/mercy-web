import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    const { total, items, affiliateCode, userId, shippingInfo } = req.body;
    
    // Auto-generate ordercode e.g. MERCY-48190
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderCode = `MERCY-${randomNum}`;
    
    const order = await prisma.orders.create({
      data: {
        order_code: orderCode,
        total: BigInt(total || 0),
        subtotal: BigInt(total || 0),
        discount_amount: BigInt(0),
        shipping_fee: BigInt(0),
        customer_name: shippingInfo?.name || 'Khách hàng',
        customer_phone: shippingInfo?.phone || '',
        customer_email: shippingInfo?.email || null,
        shipping_address: shippingInfo?.address || '',
        user_id: userId || null,
        payment_method: shippingInfo?.paymentMethod || 'cod',
        notes: shippingInfo?.notes || null,
      }
    });

    // Create order items if provided
    if (items && items.length > 0) {
      await prisma.order_items.createMany({
        data: items.map((item: any) => ({
          order_id: order.id,
          product_id: item.productId || item.product_id || '',
          product_name: item.productName || item.product_name || item.name || '',
          variant_name: item.variantName || item.variant_name || null,
          warranty_name: item.warrantyName || item.warranty_name || null,
          warranty_fee: BigInt(item.warrantyFee || item.warranty_fee || 0),
          price: BigInt(item.price || 0),
          original_price: BigInt(item.originalPrice || item.original_price || 0),
          quantity: item.quantity || 1,
          image_url: item.imageUrl || item.image_url || null,
        })),
      });
    }

    res.json({
      success: true,
      message: 'Order created',
      data: {
        id: order.id,
        orderCode: order.order_code,
        total: Number(order.total),
        status: order.status,
        createdAt: order.created_at,
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, error: 'Cannot create order' });
  }
});

export default router;
