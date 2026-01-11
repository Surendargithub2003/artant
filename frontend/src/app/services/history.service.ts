import { Injectable, signal } from '@angular/core';
import { Artwork } from '../models/artwork';

@Injectable({
    providedIn: 'root'
})
export class HistoryService {
    private readonly STORAGE_KEY = 'art_marketplace_history';
    viewedArtworks = signal<Artwork[]>([]);

    constructor() {
        this.loadHistory();
    }

    private loadHistory() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            this.viewedArtworks.set(JSON.parse(stored));
        }
    }

    addToHistory(artwork: Artwork) {
        const current = this.viewedArtworks();
        // Remove if already exists to move it to the top (front)
        const filtered = current.filter(a => a._id !== artwork._id);
        // Add to beginning
        const updated = [artwork, ...filtered].slice(0, 10); // Keep max 10

        this.viewedArtworks.set(updated);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    }

    clearHistory() {
        this.viewedArtworks.set([]);
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
