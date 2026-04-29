import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import orderRoutes from './routes/orders';
import productRoutes from './routes/products';
import articleRoutes from './routes/articles';
import reviewRoutes from './routes/reviews';
import bankRoutes from './routes/bank';
import contactRoutes from './routes/contact';
import settingsRoutes from './routes/settings';
import bannerRoutes from './routes/banners';
import { startAcbCronJob } from './cron/acbJob';
import { FRONTEND_URL, SERVER_PORT } from './config';

// Enable BigInt JSON serialization
(BigInt.prototype as any).toJSON = function () { return Number(this); };

const app = express();
const PORT = SERVER_PORT;

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/banners', bannerRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// In production, serve the React build from the project root /dist directory.
// server/src/index.ts -> server/src -> server -> project root -> dist
const clientDistPath = path.resolve(__dirname, '../../dist');
const publicPath = path.resolve(__dirname, '../../public');
app.use(express.static(clientDistPath));
app.use(express.static(publicPath)); // Serve uploaded banners from public/

// React Router fallback for non-API routes such as /login, /shop, /admin.
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startAcbCronJob();
});
