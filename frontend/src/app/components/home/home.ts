import { Component, OnInit, signal, computed, HostListener } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Artwork } from '../../models/artwork';
import { ArtworkService } from '../../services/artwork.service';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../../services/wishlist.service';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { HistoryService } from '../../services/history.service';

import { TiltDirective } from '../../directives/tilt.directive';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule, LightboxComponent, NgClass],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  artworks = signal<Artwork[]>([]);
  currentCategory = signal<string>('All');
  selectedArtwork = signal<Artwork | null>(null); // For Lightbox
  scrollY = signal<number>(0); // For Parallax Background

  @HostListener('window:scroll')
  onScroll() {
    this.scrollY.set(window.scrollY);
  }

  // Advanced Filters
  searchQuery = signal<string>('');
  maxPrice = signal<number>(50000); // For filtering (updates on release)

  // Computed signal for Filtering
  filteredArtworks = computed(() => {
    const category = this.currentCategory();
    const query = this.searchQuery().toLowerCase();
    const price = this.maxPrice();

    return this.artworks().filter(art => {
      const matchesCategory = category === 'All' || art.category === category;
      const matchesSearch = (art.title.toLowerCase().includes(query) ||
        art.artist.toLowerCase().includes(query));
      const matchesPrice = (art.price || 0) <= price;

      return matchesCategory && matchesSearch && matchesPrice;
    });
  });

  // Extract unique categories from artworks
  categories = computed(() => {
    const allCategories = this.artworks().map(art => art.category).filter(c => c).map(c => c!.trim());
    return ['All', ...new Set(allCategories)];
  });

  // Get 2 most recent artworks for Hero
  recentArtworks = computed(() => {
    return this.artworks().slice(-2).reverse();
  });
  // Featured Artist Configuration
  featuredArtist = signal({
    name: 'Surendar',
    title: 'Master of Realism',
    bio: 'Renowned for capturing the soul of his subjects, Surendar blends classical techniques with modern emotive storytelling. His pencil portraits and oil paintings have been celebrated for their photorealistic detail and profound depth.',
    quote: 'Art is not just what you see, but what you make others feel.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop', // Placeholder artistic shot
    id: 'surendar-feature'
  });

  // Virtual Framing State
  currentFrame = signal<string>('none');

  setFrame(style: string) {
    this.currentFrame.set(style);
  }

  // Get artworks by the featured artist
  featuredArtistWorks = computed(() => {
    return this.artworks()
      .filter(art => art.artist.toLowerCase().includes('surendar'))
      .slice(0, 3);
  });

  constructor(
    private artworkService: ArtworkService,
    public wishlistService: WishlistService,
    public historyService: HistoryService
  ) { }

  ngOnInit(): void {
    this.artworkService.getArtworks().subscribe({
      next: (data) => this.artworks.set(data),
      error: (err) => console.error('Error fetching artworks', err)
    });
  }

  setCategory(category: string) {
    this.currentCategory.set(category);
    this.scrollToGallery();
  }

  scrollToGallery() {
    document.getElementById('gallery-grid')?.scrollIntoView({ behavior: 'smooth' });
  }

  commitPriceFilter(value: string | number) {
    this.maxPrice.set(Number(value));
  }

  toggleWishlist(event: Event, artwork: Artwork) {
    event.stopPropagation();
    event.preventDefault();
    this.wishlistService.toggleWishlist(artwork);
  }



  openLightbox(event: Event, artwork: Artwork) {
    event.stopPropagation();
    event.preventDefault();
    this.selectedArtwork.set(artwork);
  }
}
