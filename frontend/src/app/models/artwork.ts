export interface Artwork {
    _id?: string; // Optional for creation
    title: string;
    artist: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    medium: string;
    year: string;
    dimensions: string;
    available: boolean;
    createdAt?: string;
}
