import express, { Request, Response } from 'express';
import Order from '../models/Order';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all orders (Protected)
router.get('/', auth, async (req: Request, res: Response) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Create new order (Protected)
router.post('/', auth, async (req: Request, res: Response) => {
    const order = new Order({
        clientName: req.body.clientName,
        contactInfo: req.body.contactInfo,
        artworkTitle: req.body.artworkTitle,
        totalAmount: req.body.totalAmount,
        advanceAmount: req.body.advanceAmount,
        status: req.body.status,
        notes: req.body.notes
    });

    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Update order (Protected)
router.put('/:id', auth, async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (req.body.clientName) order.clientName = req.body.clientName;
        if (req.body.contactInfo) order.contactInfo = req.body.contactInfo;
        if (req.body.artworkTitle) order.artworkTitle = req.body.artworkTitle;
        if (req.body.totalAmount !== undefined) order.totalAmount = req.body.totalAmount;
        if (req.body.advanceAmount !== undefined) order.advanceAmount = req.body.advanceAmount;
        if (req.body.status) order.status = req.body.status;
        if (req.body.notes) order.notes = req.body.notes;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Delete order (Protected)
router.delete('/:id', auth, async (req: Request, res: Response) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted Order' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
