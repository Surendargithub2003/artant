import { Request, Response, NextFunction } from 'express';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    // Simple check for "admin" authorization header
    // In a real app, use JWT verification
    const token = req.header('Authorization');

    if (token === 'admin-secret-token') {
        next();
    } else {
        res.status(401).json({ message: 'Access denied. Invalid token.' });
    }
};
