import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artwork } from '../models/artwork';

@Injectable({
    providedIn: 'root'
})
export class ArtworkService {
    private apiUrl = 'http://localhost:3000/api/artworks';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Authorization': 'admin-secret-token' // Simple auth
        });
    }

    getArtworks(): Observable<Artwork[]> {
        return this.http.get<Artwork[]>(this.apiUrl);
    }

    getArtwork(id: string): Observable<Artwork> {
        return this.http.get<Artwork>(`${this.apiUrl}/${id}`);
    }

    createArtwork(artwork: Artwork): Observable<Artwork> {
        return this.http.post<Artwork>(this.apiUrl, artwork, { headers: this.getAuthHeaders() });
    }

    updateArtwork(id: string, artwork: Partial<Artwork>): Observable<Artwork> {
        return this.http.put<Artwork>(`${this.apiUrl}/${id}`, artwork, { headers: this.getAuthHeaders() });
    }

    deleteArtwork(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    sendInquiry(data: any): Observable<any> {
        // Construct API URL for contact
        // If apiUrl is '.../api/artworks', we want '.../api/contact/inquire'
        const contactUrl = this.apiUrl.replace('/artworks', '/contact/inquire');
        return this.http.post(contactUrl, data);
    }
}
