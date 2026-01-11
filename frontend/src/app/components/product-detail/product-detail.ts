import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Artwork } from '../../models/artwork';
import { ArtworkService } from '../../services/artwork.service';
import { CommonModule, NgClass } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, FormsModule, NgClass],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetailComponent implements OnInit {
  artwork = signal<Artwork | undefined>(undefined);
  relatedArtworks = signal<Artwork[]>([]);

  // Email Inquiry Modal State
  showEmailModal = signal(false);
  inquiryForm = {
    name: '',
    email: '',
    message: ''
  };
  isSending = signal(false);

  // Virtual Framing
  currentFrame = signal<string>('none');

  setFrame(style: string) {
    this.currentFrame.set(style);
  }

  constructor(
    private route: ActivatedRoute,
    private artworkService: ArtworkService,
    private toast: ToastService,
    private historyService: HistoryService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadArtwork(id);
      }
    });
  }

  loadArtwork(id: string) {
    this.artworkService.getArtwork(id).subscribe({
      next: (data) => {
        this.artwork.set(data);
        this.loadRelatedArtworks(data);
        this.historyService.addToHistory(data);
        window.scrollTo(0, 0);
      },
      error: (err) => console.error('Error loading artwork', err)
    });
  }

  loadRelatedArtworks(currentArt: Artwork) {
    this.artworkService.getArtworks().subscribe(allArt => {
      const related = allArt
        .filter(a => a.category === currentArt.category && a._id !== currentArt._id)
        .slice(0, 3); // Limit to 3
      this.relatedArtworks.set(related);
    });
  }

  inquire(): void {
    const art = this.artwork();
    if (!art) return;

    // Default phone number from Contact page
    const phoneNumber = '918667886018';

    let frameNote = '';
    if (this.currentFrame() && this.currentFrame() !== 'none') {
      const style = this.currentFrame().charAt(0).toUpperCase() + this.currentFrame().slice(1);
      frameNote = ` (With ${style} Frame option)`;
    }

    const message = `Halo, I am interested in purchasing "${art.title}" by ${art.artist} (Price: ₹${art.price})${frameNote}. Is it still available?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  }

  openEmailModal(): void {
    const art = this.artwork();
    if (!art) return;

    let frameNote = '';
    if (this.currentFrame() && this.currentFrame() !== 'none') {
      const style = this.currentFrame().charAt(0).toUpperCase() + this.currentFrame().slice(1);
      frameNote = ` (With ${style} Frame option)`;
    }

    this.inquiryForm.message = `I am interested in purchasing "${art.title}" by ${art.artist} (Price: ₹${art.price})${frameNote}. Please let me know if it is still available.`;
    this.showEmailModal.set(true);
  }

  closeEmailModal(): void {
    this.showEmailModal.set(false);
  }

  submitInquiry(): void {
    const art = this.artwork();
    if (!art) return;

    this.isSending.set(true);

    const payload = {
      name: this.inquiryForm.name,
      email: this.inquiryForm.email,
      message: this.inquiryForm.message,
      artworkTitle: art.title
    };

    this.artworkService.sendInquiry(payload).subscribe({
      next: () => {
        this.toast.show('Your inquiry has been sent successfully!', 'success');
        this.isSending.set(false);
        this.closeEmailModal();
      },
      error: (err) => {
        console.error('Email error', err);
        this.toast.show('Failed to send email. Please try WhatsApp instead.', 'error');
        this.isSending.set(false);
      }
    });
  }

  shareArtwork() {
    const art = this.artwork();
    if (!art) return;

    if (navigator.share) {
      navigator.share({
        title: `${art.title} by ${art.artist}`,
        text: `Check out this amazing artwork: ${art.title}`,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.toast.show('Link copied to clipboard!', 'success');
      });
    }
  }
}
