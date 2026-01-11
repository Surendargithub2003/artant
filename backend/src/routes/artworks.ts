import express, { Request, Response } from 'express';
import Artwork, { IArtwork } from '../models/Artwork';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all artworks (Public)
router.get('/', async (req: Request, res: Response) => {
    try {
        const artworks = await Artwork.find().sort({ createdAt: -1 });
        res.json(artworks);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Get one artwork (Public)
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const artwork = await Artwork.findById(req.params.id);
        if (!artwork) return res.status(404).json({ message: 'Cannot find artwork' });
        res.json(artwork);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Create artwork (Protected)
router.post('/', auth, async (req: Request, res: Response) => {
    const artwork = new Artwork({
        title: req.body.title,
        artist: req.body.artist,
        description: req.body.description,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        category: req.body.category,
        medium: req.body.medium,
        year: req.body.year,
        dimensions: req.body.dimensions
    });

    try {
        const newArtwork = await artwork.save();
        res.status(201).json(newArtwork);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Update artwork (Protected)
router.put('/:id', auth, async (req: Request, res: Response) => {
    try {
        const artwork = await Artwork.findById(req.params.id);
        if (!artwork) return res.status(404).json({ message: 'Cannot find artwork' });

        if (req.body.title) artwork.title = req.body.title;
        if (req.body.artist) artwork.artist = req.body.artist;
        if (req.body.description) artwork.description = req.body.description;
        if (req.body.price) artwork.price = req.body.price;
        if (req.body.imageUrl) artwork.imageUrl = req.body.imageUrl;
        if (req.body.category) artwork.category = req.body.category;
        if (req.body.medium) artwork.medium = req.body.medium;
        if (req.body.year) artwork.year = req.body.year;
        if (req.body.dimensions) artwork.dimensions = req.body.dimensions;
        if (req.body.available !== undefined) artwork.available = req.body.available;


        const updatedArtwork = await artwork.save();
        res.json(updatedArtwork);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Delete artwork (Protected)
router.delete('/:id', auth, async (req: Request, res: Response) => {
    try {
        await Artwork.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted Artwork' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
