import { Injectable, signal, computed } from '@angular/core';
import { Artwork } from '../models/artwork';

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private wishlistKey = 'art_gallery_wishlist';
    wishlist = signal<Artwork[]>([]);

    constructor() {
        this.loadWishlist();
    }

    private loadWishlist() {
        const saved = localStorage.getItem(this.wishlistKey);
        if (saved) {
            this.wishlist.set(JSON.parse(saved));
        }
    }

    private saveWishlist() {
        localStorage.setItem(this.wishlistKey, JSON.stringify(this.wishlist()));
    }

    addToWishlist(artwork: Artwork) {
        this.wishlist.update(list => {
            if (list.some(item => item._id === artwork._id)) return list;
            return [...list, artwork];
        });
        this.saveWishlist();
    }

    removeFromWishlist(id: string) {
        this.wishlist.update(list => list.filter(item => item._id !== id));
        this.saveWishlist();
    }

    toggleWishlist(artwork: Artwork) {
        if (this.isInWishlist(artwork._id)) {
            this.removeFromWishlist(artwork._id!);
        } else {
            this.addToWishlist(artwork);
        }
    }

    isInWishlist(id: string | undefined): boolean {
        if (!id) return false;
        return this.wishlist().some(item => item._id === id);
    }
}
