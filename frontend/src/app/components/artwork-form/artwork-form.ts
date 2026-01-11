import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Artwork } from '../../models/artwork';
import { ArtworkService } from '../../services/artwork.service';

@Component({
  selector: 'app-artwork-form',
  imports: [FormsModule],
  templateUrl: './artwork-form.html',
  styleUrl: './artwork-form.scss'
})
export class ArtworkFormComponent implements OnChanges {
  @Input() artwork: Artwork | null = null;
  @Output() close = new EventEmitter<boolean>();

  formData: Artwork = this.getEmptyArtwork();
  previewUrl: string | null = null;

  constructor(private artworkService: ArtworkService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.artwork) {
      this.formData = { ...this.artwork };
      this.previewUrl = this.artwork.imageUrl;
    } else {
      this.formData = this.getEmptyArtwork();
      this.previewUrl = null;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.formData.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  getEmptyArtwork(): Artwork {
    return {
      title: '',
      artist: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: '',
      medium: '',
      year: '',
      dimensions: '',
      available: true
    };
  }

  save() {
    if (this.artwork && this.artwork._id) {
      this.artworkService.updateArtwork(this.artwork._id, this.formData).subscribe({
        next: () => this.close.emit(true),
        error: (err) => alert('Error updating artwork: ' + err.message)
      });
    } else {
      this.artworkService.createArtwork(this.formData).subscribe({
        next: () => this.close.emit(true),
        error: (err) => alert('Error creating artwork: ' + err.message)
      });
    }
  }

  cancel() {
    this.close.emit(false);
  }
}
