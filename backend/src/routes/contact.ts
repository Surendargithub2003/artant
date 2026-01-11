import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import Message from '../models/Message';
import { auth } from '../middleware/auth';

const router = express.Router();

// POST /api/contact/inquire
router.post('/inquire', async (req: Request, res: Response) => {
    const { name, email, message, artworkTitle } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Please provide name, email, and message.' });
    }

    try {
        // 1. Save to Database
        const newMessage = new Message({
            name,
            email,
            message,
            artworkTitle
        });
        await newMessage.save();

        // 2. Send Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.EMAIL_USER, // Admin email
            replyTo: email,
            subject: `New Inquiry: ${artworkTitle || 'General Inquiry'}`,
            text: `
Name: ${name}
Email: ${email}
Artwork: ${artworkTitle || 'N/A'}

Message:
${message}
            `,
            html: `
<h3>New Artwork Inquiry</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Artwork:</strong> ${artworkTitle || 'N/A'}</p>
<br>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Inquiry sent and saved successfully!' });

    } catch (error: any) {
        console.error('Inquiry process error:', error);
        // Even if email fails, if DB save worked, we might want to tell user 'Saved, but email failed'.
        // For simplicity, we return 500.
        res.status(500).json({ message: 'Failed to process inquiry.', error: error.message });
    }
});

// GET /api/contact/messages (Protected)
router.get('/messages', auth, async (req: Request, res: Response) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

// PUT /api/contact/messages/:id/read (Protected)
router.put('/messages/:id/read', auth, async (req: Request, res: Response) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error updating message status' });
    }
});

export default router;
