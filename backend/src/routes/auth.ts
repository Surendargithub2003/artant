import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/login', (req: Request, res: Response) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        console.error('ADMIN_PASSWORD not set in environment variables');
        return res.status(500).json({ message: 'Server configuration error' });
    }

    if (password === adminPassword) {
        // In a real app, generate a JWT here. 
        // For now, return the static token the frontend expects.
        res.json({ token: 'admin-secret-token' });
    } else {
        res.status(401).json({ message: 'Invalid password' });
    }
});

export default router;
