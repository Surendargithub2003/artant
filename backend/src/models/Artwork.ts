import mongoose, { Schema, Document } from 'mongoose';

export interface IArtwork extends Document {
    title: string;
    artist: string; // Keeping artist for now, though minimalist requirement didn't explicitly remove it
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    medium: string;
    year: string;
    dimensions: string;
    available: boolean;
    createdAt: Date;
}

const ArtworkSchema: Schema = new Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true }, // Keeping for completeness
    description: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String },
    medium: { type: String },
    year: { type: String },
    dimensions: { type: String },
    available: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IArtwork>('Artwork', ArtworkSchema);
