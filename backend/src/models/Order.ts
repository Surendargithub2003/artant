import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    clientName: string;
    contactInfo: string;
    artworkTitle: string;
    totalAmount: number;
    advanceAmount: number;
    status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
    notes: string;
    createdAt: Date;
}

const OrderSchema: Schema = new Schema({
    clientName: { type: String, required: true },
    contactInfo: { type: String, required: true },
    artworkTitle: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    advanceAmount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IOrder>('Order', OrderSchema);
