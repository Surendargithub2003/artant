import express, { Express, Request, Response } from 'express';
// Force restart to load env
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import artworkRoutes from './routes/artworks';
import contactRoutes from './routes/contact';
import orderRoutes from './routes/orders';
import authRoutes from './routes/auth';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/art-marketplace')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/api/artworks', artworkRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server is running. API at /api/artworks');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
