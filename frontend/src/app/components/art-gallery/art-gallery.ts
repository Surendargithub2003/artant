import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Artwork } from '../../models/artwork';
import { ArtworkService } from '../../services/artwork.service';

@Component({
  selector: 'app-art-gallery',
  imports: [RouterLink],
  templateUrl: './art-gallery.html',
  styleUrl: './art-gallery.scss'
})
export class ArtGalleryComponent implements OnInit {
  artworks: Artwork[] = [];

  constructor(private artworkService: ArtworkService) { }

  ngOnInit(): void {
    this.artworkService.getArtworks().subscribe({
      next: (data) => this.artworks = data,
      error: (err) => console.error('Error fetching artworks', err)
    });
  }
}
