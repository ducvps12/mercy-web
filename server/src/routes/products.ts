import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET all active products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      where: { is_active: true },
      orderBy: { id: 'asc' },
    });
    const allImages = await prisma.product_images.findMany({ orderBy: { sort_order: 'asc' } });
    const imageMap: Record<string, string[]> = {};
    for (const img of allImages) {
      if (!imageMap[img.product_id]) imageMap[img.product_id] = [];
      imageMap[img.product_id].push(img.image_url);
    }
    
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
        featuresVn: p.features_vn || '',
        featuresEn: p.features_en || '',
        footerInfo: p.footer_info || '',
        productionYear: p.production_year,
        clearancePrice: Number(p.clearance_price || 0),
        dailySalePrice: Number(p.daily_sale_price || 0),
        campaignPrice: Number(p.campaign_price || 0),
        offPlatformPrice: Number(p.off_platform_price || 0),
        warrantyData: p.warranty_data || '',
      };
    });
    res.json(mapped);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET all brands distinct
router.get('/brands', async (req, res) => {
  try {
    const products = await prisma.products.findMany({ select: { brand: true }, distinct: ['brand'], where: { is_active: true } });
    const brands = products.map(p => p.brand).filter(Boolean);
    res.json(brands);
  } catch (error) {
    res.status(500).json([]);
  }
});

// GET all categories
router.get('/categories', async (req, res) => {
  try {
    const cats = await prisma.categories.findMany({ where: { is_active: true }, orderBy: { sort_order: 'asc' } });
    const mapped = cats.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon || '',
      parentId: c.parent_id
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json([]);
  }
});

// GET single product by ID or SKU
router.get('/:identifier', async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let product;

    // Try finding by ID first if it's a number
    if (!isNaN(Number(identifier))) {
      product = await prisma.products.findUnique({ where: { id: Number(identifier) } });
    }

    // If not found, try finding by SKU or product_id
    if (!product) {
      product = await prisma.products.findFirst({
        where: {
          OR: [
            { sku: identifier },
            { product_id: identifier }
          ]
        }
      });
    }

    if (!product || product.is_active === false) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    const [images, specs, variants, reviews] = await Promise.all([
      prisma.product_images.findMany({ where: { product_id: product.product_id }, orderBy: { sort_order: 'asc' } }),
      prisma.product_specs.findMany({ where: { product_id: product.product_id }, orderBy: { sort_order: 'asc' } }),
      prisma.product_variants.findMany({ where: { product_id: product.product_id }, where: { is_active: true } }),
      prisma.product_reviews.findMany({ where: { product_id: product.product_id, is_active: true }, orderBy: { sort_order: 'asc' } }),
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
      featuresVn: product.features_vn || '',
      featuresEn: product.features_en || '',
      footerInfo: product.footer_info || '',
      productionYear: product.production_year,
      clearancePrice: Number(product.clearance_price || 0),
      dailySalePrice: Number(product.daily_sale_price || 0),
      campaignPrice: Number(product.campaign_price || 0),
      offPlatformPrice: Number(product.off_platform_price || 0),
      warrantyData: product.warranty_data || '',
      image: images.length > 0 ? images[0].image_url : '',
      images: images.map(img => img.image_url), // simplified for frontend
      specs: specs.map(s => ({ id: s.id, label: s.spec_name, value: s.spec_value })),
      variants: variants.map(v => ({ id: v.id, name: v.variant_name })),
      reviews: reviews.map(r => ({ id: r.id, name: r.reviewer_name, avatarLetter: r.avatar_letter, avatarColor: r.avatar_color, rating: r.rating, date: r.review_date, verified: r.is_verified, text: r.review_text, helpful: r.helpful_count, imageUrl: r.image_url })),
    });
  } catch (error) {
    console.error('Get product detail error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

export default router;
