import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Middleware to check admin role
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

// ═══════════════════════════════════
// MEMBERS (Users)
// ═══════════════════════════════════

// GET all users
router.get('/members', async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: { id: true, email: true, full_name: true, username: true, role: true, phone: true, is_active: true, created_at: true },
      orderBy: { created_at: 'desc' },
    });
    // Map to frontend expected format
    const mapped = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.full_name || u.username,
      role: u.role,
      phone: u.phone,
      isActive: u.is_active,
      createdAt: u.created_at,
    }));
    res.json(mapped);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Toggle user role
router.put('/members/:id/role', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    const updated = await prisma.users.update({
      where: { id },
      data: { role: newRole },
      select: { id: true, email: true, full_name: true, role: true },
    });
    res.json({ id: updated.id, email: updated.email, name: updated.full_name, role: updated.role });
  } catch (error) {
    console.error('Toggle role error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Delete user
router.delete('/members/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.users.delete({ where: { id } });
    res.json({ message: 'Đã xóa thành viên' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ═══════════════════════════════════
// ORDERS
// ═══════════════════════════════════

// GET all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.orders.findMany({
      include: { order_items: true },
      orderBy: { created_at: 'desc' },
    });
    // Map to frontend expected format
    const mapped = orders.map(o => ({
      id: o.id,
      orderCode: o.order_code,
      userId: o.user_id,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      customerEmail: o.customer_email,
      shippingAddress: o.shipping_address,
      subtotal: Number(o.subtotal),
      discountAmount: Number(o.discount_amount),
      shippingFee: Number(o.shipping_fee),
      total: Number(o.total),
      paymentMethod: o.payment_method,
      status: o.status,
      notes: o.notes,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
      items: o.order_items.map(i => ({
        id: i.id,
        productId: i.product_id,
        productName: i.product_name,
        variantName: i.variant_name,
        warrantyName: i.warranty_name,
        warrantyFee: Number(i.warranty_fee || 0),
        price: Number(i.price),
        originalPrice: Number(i.original_price),
        quantity: i.quantity,
        imageUrl: i.image_url,
      })),
    }));
    res.json(mapped);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const order = await prisma.orders.update({
      where: { id },
      data: { status },
    });
    res.json({ id: order.id, status: order.status });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ═══════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════

router.get('/products', async (req, res) => {
  try {
    const products = await prisma.products.findMany({ orderBy: { id: 'asc' } });
    // Fetch all images in one query
    const allImages = await prisma.product_images.findMany({ orderBy: { sort_order: 'asc' } });
    const imageMap: Record<string, string[]> = {};
    for (const img of allImages) {
      if (!imageMap[img.product_id]) imageMap[img.product_id] = [];
      imageMap[img.product_id].push(img.image_url);
    }
    // Map to frontend expected format
    const mapped = products.map(p => {
      const imgs = imageMap[p.product_id] || [];
      return {
        id: p.id,
        sku: p.sku || p.product_id,
        name: p.name,
        price: Number(p.price),
        originalPrice: Number(p.original_price),
        description: p.description || '',
        category: p.category_name || '',
        image: imgs[0] || '',
        images: imgs.join(','),
        productId: p.product_id,
        shortName: p.short_name,
        discount: p.discount,
        rating: p.rating ? Number(p.rating) : 0,
        sold: p.sold || 0,
        stock: p.stock || 0,
        isFlashSale: p.is_flash_sale,
        flashSalePercent: p.flash_sale_percent,
        shopeeUrl: p.shopee_url,
        tiktokUrl: p.tiktok_url,
        isActive: p.is_active,
      };
    });
    res.json(mapped);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET single product with full details
router.get('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.products.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    const [images, specs, variants, reviews] = await Promise.all([
      prisma.product_images.findMany({ where: { product_id: product.product_id }, orderBy: { sort_order: 'asc' } }),
      prisma.product_specs.findMany({ where: { product_id: product.product_id }, orderBy: { sort_order: 'asc' } }),
      prisma.product_variants.findMany({ where: { product_id: product.product_id } }),
      prisma.product_reviews.findMany({ where: { product_id: product.product_id }, orderBy: { sort_order: 'asc' } }),
    ]);

    res.json({
      id: product.id,
      productId: product.product_id,
      sku: product.sku || product.product_id,
      name: product.name,
      shortName: product.short_name || '',
      categoryId: product.category_id,
      categoryName: product.category_name || '',
      price: Number(product.price),
      originalPrice: Number(product.original_price),
      discount: product.discount || 0,
      badge: product.badge || '',
      rating: product.rating ? Number(product.rating) : 0,
      sold: product.sold || 0,
      stock: product.stock || 0,
      brand: product.brand || 'Mercy Tech Global',
      description: product.description || '',
      seoTags: product.seo_tags || '',
      shopeeUrl: product.shopee_url || '',
      tiktokUrl: product.tiktok_url || '',
      isFlashSale: product.is_flash_sale || false,
      flashSalePercent: product.flash_sale_percent || 0,
      isActive: product.is_active !== false,
      images: images.map(img => ({ id: img.id, url: img.image_url, sortOrder: img.sort_order })),
      specs: specs.map(s => ({ id: s.id, name: s.spec_name, value: s.spec_value, sortOrder: s.sort_order })),
      variants: variants.map(v => ({ id: v.id, name: v.variant_name, isActive: v.is_active })),
      reviews: reviews.map(r => ({ id: r.id, name: r.reviewer_name, avatarLetter: r.avatar_letter, avatarColor: r.avatar_color, rating: r.rating, date: r.review_date, verified: r.is_verified, text: r.review_text, helpful: r.helpful_count, imageUrl: r.image_url, isActive: r.is_active })),
    });
  } catch (error) {
    console.error('Get product detail error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const product = await prisma.products.create({ data: req.body });
    res.json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Lỗi tạo sản phẩm' });
  }
});

// PUT update product with full details (info + images + specs + variants)
router.put('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.products.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    const { images, specs, variants, ...productData } = req.body;

    // Update product fields
    const updateData: any = {};
    if (productData.name !== undefined) updateData.name = productData.name;
    if (productData.shortName !== undefined) updateData.short_name = productData.shortName;
    if (productData.sku !== undefined) updateData.sku = productData.sku;
    if (productData.categoryName !== undefined) updateData.category_name = productData.categoryName;
    if (productData.categoryId !== undefined) updateData.category_id = productData.categoryId;
    if (productData.price !== undefined) updateData.price = BigInt(productData.price);
    if (productData.originalPrice !== undefined) updateData.original_price = BigInt(productData.originalPrice);
    if (productData.discount !== undefined) updateData.discount = productData.discount;
    if (productData.badge !== undefined) updateData.badge = productData.badge || null;
    if (productData.rating !== undefined) updateData.rating = productData.rating;
    if (productData.sold !== undefined) updateData.sold = productData.sold;
    if (productData.stock !== undefined) updateData.stock = productData.stock;
    if (productData.brand !== undefined) updateData.brand = productData.brand;
    if (productData.description !== undefined) updateData.description = productData.description;
    if (productData.seoTags !== undefined) updateData.seo_tags = productData.seoTags;
    if (productData.shopeeUrl !== undefined) updateData.shopee_url = productData.shopeeUrl || null;
    if (productData.tiktokUrl !== undefined) updateData.tiktok_url = productData.tiktokUrl || null;
    if (productData.isFlashSale !== undefined) updateData.is_flash_sale = productData.isFlashSale;
    if (productData.flashSalePercent !== undefined) updateData.flash_sale_percent = productData.flashSalePercent;
    if (productData.isActive !== undefined) updateData.is_active = productData.isActive;

    const product = await prisma.products.update({ where: { id }, data: updateData });

    // Update images if provided (replace all)
    if (images !== undefined) {
      await prisma.product_images.deleteMany({ where: { product_id: existing.product_id } });
      if (images.length > 0) {
        await prisma.product_images.createMany({
          data: images.map((img: any, idx: number) => ({
            product_id: existing.product_id,
            image_url: img.url,
            sort_order: idx,
          })),
        });
      }
    }

    // Update specs if provided (replace all)
    if (specs !== undefined) {
      await prisma.product_specs.deleteMany({ where: { product_id: existing.product_id } });
      if (specs.length > 0) {
        await prisma.product_specs.createMany({
          data: specs.map((s: any, idx: number) => ({
            product_id: existing.product_id,
            spec_name: s.name,
            spec_value: s.value,
            sort_order: idx,
          })),
        });
      }
    }

    // Update variants if provided (replace all)
    if (variants !== undefined) {
      await prisma.product_variants.deleteMany({ where: { product_id: existing.product_id } });
      if (variants.length > 0) {
        await prisma.product_variants.createMany({
          data: variants.map((v: any) => ({
            product_id: existing.product_id,
            variant_name: v.name,
            is_active: v.isActive !== false,
          })),
        });
      }
    }

    // Update reviews if provided (replace all)
    if (req.body.reviews !== undefined) {
      await prisma.product_reviews.deleteMany({ where: { product_id: existing.product_id } });
      const reviews = req.body.reviews;
      if (reviews.length > 0) {
        await prisma.product_reviews.createMany({
          data: reviews.map((r: any, idx: number) => ({
            product_id: existing.product_id,
            reviewer_name: r.name,
            avatar_letter: r.avatarLetter || r.name?.charAt(0)?.toUpperCase() || '?',
            avatar_color: r.avatarColor || 'bg-red-500',
            rating: r.rating || 5,
            review_date: r.date,
            is_verified: r.verified || false,
            review_text: r.text,
            helpful_count: r.helpful || 0,
            image_url: r.imageUrl || '',
            is_active: r.isActive !== false,
            sort_order: idx,
          })),
        });
      }
    }

    res.json({ message: 'Cập nhật thành công', id: product.id });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Lỗi cập nhật sản phẩm' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.products.findUnique({ where: { id } });
    if (product) {
      // Clean up related data
      await prisma.product_images.deleteMany({ where: { product_id: product.product_id } });
      await prisma.product_specs.deleteMany({ where: { product_id: product.product_id } });
      await prisma.product_variants.deleteMany({ where: { product_id: product.product_id } });
    }
    await prisma.products.delete({ where: { id } });
    res.json({ message: 'Đã xóa sản phẩm' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Lỗi xóa sản phẩm' });
  }
});

// ═══════════════════════════════════
// REVIEWS
// ═══════════════════════════════════

router.get('/reviews/:productId', async (req, res) => {
  try {
    const reviews = await prisma.product_reviews.findMany({
      where: { product_id: req.params.productId },
      orderBy: { sort_order: 'asc' },
    });
    res.json(reviews.map(r => ({
      id: r.id, name: r.reviewer_name, avatarLetter: r.avatar_letter, avatarColor: r.avatar_color,
      rating: r.rating, date: r.review_date, verified: r.is_verified, text: r.review_text,
      helpful: r.helpful_count, imageUrl: r.image_url, isActive: r.is_active,
    })));
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.post('/reviews', async (req, res) => {
  try {
    const { productId, name, avatarLetter, avatarColor, rating, date, verified, text, helpful, imageUrl } = req.body;
    const review = await prisma.product_reviews.create({
      data: {
        product_id: productId,
        reviewer_name: name,
        avatar_letter: avatarLetter || name.charAt(0).toUpperCase(),
        avatar_color: avatarColor || 'bg-red-500',
        rating: rating || 5,
        review_date: date,
        is_verified: verified || false,
        review_text: text,
        helpful_count: helpful || 0,
        image_url: imageUrl || '',
      },
    });
    res.json({ id: review.id, message: 'Đã thêm đánh giá' });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Lỗi tạo đánh giá' });
  }
});

router.put('/reviews/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, avatarLetter, avatarColor, rating, date, verified, text, helpful, imageUrl, isActive } = req.body;
    const updateData: any = {};
    if (name !== undefined) updateData.reviewer_name = name;
    if (avatarLetter !== undefined) updateData.avatar_letter = avatarLetter;
    if (avatarColor !== undefined) updateData.avatar_color = avatarColor;
    if (rating !== undefined) updateData.rating = rating;
    if (date !== undefined) updateData.review_date = date;
    if (verified !== undefined) updateData.is_verified = verified;
    if (text !== undefined) updateData.review_text = text;
    if (helpful !== undefined) updateData.helpful_count = helpful;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;
    if (isActive !== undefined) updateData.is_active = isActive;
    await prisma.product_reviews.update({ where: { id }, data: updateData });
    res.json({ message: 'Đã cập nhật đánh giá' });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Lỗi cập nhật đánh giá' });
  }
});

router.delete('/reviews/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.product_reviews.delete({ where: { id } });
    res.json({ message: 'Đã xóa đánh giá' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Lỗi xóa đánh giá' });
  }
});

// ═══════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════

router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({ orderBy: { sort_order: 'asc' } });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ═══════════════════════════════════
// DASHBOARD stats
// ═══════════════════════════════════

router.get('/dashboard', async (req, res) => {
  try {
    const [totalUsers, totalOrders, totalRevenue] = await Promise.all([
      prisma.users.count(),
      prisma.orders.count(),
      prisma.orders.aggregate({ _sum: { total: true } }),
    ]);
    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: Number(totalRevenue._sum.total || 0),
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

export default router;
