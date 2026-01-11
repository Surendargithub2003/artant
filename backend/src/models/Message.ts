import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    name: string;
    email: string;
    message: string;
    artworkTitle?: string;
    createdAt: Date;
    isRead: boolean;
}

const MessageSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    artworkTitle: { type: String },
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
});

export default mongoose.model<IMessage>('Message', MessageSchema);
