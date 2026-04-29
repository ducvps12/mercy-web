import express from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { ACB_HISTORY_API_URL } from '../config';

const router = express.Router();
const prisma = new PrismaClient();

// Public endpoint to check payment status directly without needing an order in DB
router.get('/check-payment', async (req, res) => {
  try {
    const { amount, content } = req.query;
    if (!amount || !content) return res.json({ paid: false });

    if (!ACB_HISTORY_API_URL) {
      console.error('Missing ACB_HISTORY_API_URL');
      return res.json({ paid: false });
    }

    const response = await axios.get(ACB_HISTORY_API_URL);
    
    if (response.data && response.data.codeStatus === 200) {
      const transactions = response.data.data || [];
      const matched = transactions.find((tx: any) => 
        tx.type === 'IN' && 
        tx.amount === Number(amount) && 
        String(tx.description).toUpperCase().includes(String(content).toUpperCase())
      );
      
      if (matched) {
        return res.json({ paid: true });
      }
    }
    
    return res.json({ paid: false });
  } catch (error) {
    console.error('Check payment error:', error);
    res.json({ paid: false });
  }
});

router.post('/', async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.info('Incoming order POST request');
    }
    const { total, items, affiliateCode, userId, shippingInfo, orderCode: providedOrderCode, status: providedStatus } = req.body;
    
    // Auto-generate ordercode if not provided
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderCode = providedOrderCode || `MERCY-${randomNum}`;

    // Capture IP address
    const ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '';

    // Preserve 'deposit' or 'full' intention in notes since DB only accepts 'bank_transfer'
    const actualPaymentType = shippingInfo?.paymentMethod;
    let finalNotes = shippingInfo?.notes || '';
    if (actualPaymentType === 'deposit') {
      finalNotes = `[DEPOSIT] ${finalNotes}`;
    } else if (actualPaymentType === 'full') {
      finalNotes = `[FULL] ${finalNotes}`;
    }
    
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
        payment_method: (['cod', 'ewallet', 'bank_transfer'].includes(shippingInfo?.paymentMethod) ? shippingInfo.paymentMethod : 'bank_transfer'),
        notes: finalNotes || null,
        status: providedStatus || 'pending',
        ip_address: String(ipAddress).substring(0, 50),
      }
    });

    // Create order items if provided
    if (items && items.length > 0) {
      await prisma.order_items.createMany({
        data: items.map((item: any) => ({
          order_id: order.id,
          product_id: String(item.productId || item.product_id || ''),
          product_name: String(item.productName || item.product_name || item.name || ''),
          variant_name: item.variantName || item.variant_name || null,
          warranty_name: item.warrantyName || item.warranty_name || null,
          warranty_fee: BigInt(item.warrantyFee || item.warranty_fee || 0),
          price: BigInt(item.price || 0),
          original_price: BigInt(item.originalPrice || item.original_price || item.price || 0),
          quantity: Number(item.quantity || 1),
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
    res.status(500).json({ success: false, error: 'Cannot create order', details: String(error) });
  }
});

router.get('/history', async (req, res) => {
  try {
    const { codes, userId } = req.query;
    let whereClause: any = {};
    
    if (userId) {
       whereClause.user_id = Number(userId);
    } else if (codes) {
       whereClause.order_code = { in: String(codes).split(',') };
    } else {
       return res.json({ data: [] });
    }

    const orders = await prisma.orders.findMany({
      where: whereClause,
      include: {
        order_items: true
      },
      orderBy: { created_at: 'desc' }
    });

    const mapped = orders.map((o: any) => {
      let isDeposit = false;
      let cleanTransferContent = o.notes || '';
      
      if (cleanTransferContent.includes('[DEPOSIT]')) {
        isDeposit = true;
        cleanTransferContent = cleanTransferContent.replace('[DEPOSIT] ', '').replace('[DEPOSIT]', '');
      } else if (cleanTransferContent.includes('[FULL]')) {
        cleanTransferContent = cleanTransferContent.replace('[FULL] ', '').replace('[FULL]', '');
      }

      const total = Number(o.total);
      
      // Calculate deposit logic
      let finalPaymentMethod = isDeposit ? 'deposit' : 'full';
      if (o.payment_method === 'cod') finalPaymentMethod = 'cod'; // Fallback if regular COD without popup
      
      let transferAmount = isDeposit ? Math.ceil(total * 0.1) : total;
      let remainingCOD = isDeposit ? total - transferAmount : 0;

      return {
        orderCode: o.order_code,
        total: total,
        status: o.status,
        paymentMethod: finalPaymentMethod,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        customerAddress: o.shipping_address,
        createdAt: o.created_at,
        transferAmount: transferAmount,
        remainingCOD: remainingCOD,
        transferContent: cleanTransferContent,
        items: o.order_items.map((i: any) => ({
          id: i.id,
          name: i.product_name,
          price: Number(i.price),
          image: i.image_url,
          quantity: i.quantity
        }))
      };
    });
    
    res.json({ data: mapped });
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ data: [] });
  }
});

router.put('/:orderCode', async (req, res) => {
  try {
    const { orderCode } = req.params;
    const { shippingInfo, status } = req.body;
    
    // Find order
    const existing = await prisma.orders.findUnique({ where: { order_code: orderCode } });
    if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
    
    await prisma.orders.update({
      where: { order_code: orderCode },
      data: {
        customer_name: shippingInfo?.name || existing.customer_name,
        customer_phone: shippingInfo?.phone || existing.customer_phone,
        shipping_address: shippingInfo?.address || existing.shipping_address,
        status: status || existing.status,
      }
    });

    res.json({ success: true, message: 'Order updated' });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ success: false, error: 'Cannot update order', details: String(error) });
  }
});

export default router;
