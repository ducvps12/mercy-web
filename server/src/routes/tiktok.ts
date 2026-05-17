/**
 * TikTok oEmbed proxy.
 *
 * The browser cannot fetch https://www.tiktok.com/oembed directly because
 * TikTok does not return CORS headers, so signed CDN thumbnail URLs hardcoded
 * in the frontend eventually expire and fall through to the product image.
 *
 * This endpoint sits in front of TikTok's public oEmbed API to:
 *   - Fetch the latest thumbnail_url server-side
 *   - Cache the response in-memory for 6h to avoid hammering TikTok
 *   - Strip everything except the fields the frontend actually uses
 */
import express from 'express';

const router = express.Router();

interface CacheEntry {
  expiresAt: number;
  data: any;
}

const cache = new Map<string, CacheEntry>();
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

router.get('/oembed/:videoId', async (req, res) => {
  const videoId = String(req.params.videoId || '').trim();
  if (!/^\d{6,32}$/.test(videoId)) {
    return res.status(400).json({ message: 'Invalid videoId' });
  }

  // Cache hit
  const cached = cache.get(videoId);
  if (cached && cached.expiresAt > Date.now()) {
    return res.json(cached.data);
  }

  try {
    const url = `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@user/video/${videoId}`;
    const upstream = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Mercy-Server)' },
    });
    if (!upstream.ok) {
      return res.status(upstream.status).json({ message: 'TikTok oembed failed' });
    }
    const json: any = await upstream.json();
    const result = {
      videoId,
      thumbnail_url: json.thumbnail_url || null,
      title: json.title || null,
      author_name: json.author_name || null,
      author_url: json.author_url || null,
      html: json.html || null,
    };
    cache.set(videoId, { expiresAt: Date.now() + TTL_MS, data: result });
    res.json(result);
  } catch (err: any) {
    console.error('TikTok oembed error:', err?.message || err);
    res.status(502).json({ message: 'TikTok oembed proxy error' });
  }
});

export default router;
