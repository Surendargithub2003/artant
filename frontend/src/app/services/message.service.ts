import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Message {
    _id: string;
    name: string;
    email: string;
    message: string;
    artworkTitle?: string;
    createdAt: string;
    isRead: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api/contact/messages'
        : 'https://YOUR-BACKEND-APP-NAME.onrender.com/api/contact/messages';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('admin_token');
        return new HttpHeaders({
            'Authorization': 'admin-secret-token' // Assuming simple auth for now matching others
        });
    }

    getMessages(): Observable<Message[]> {
        return this.http.get<Message[]>(this.apiUrl, { headers: this.getAuthHeaders() });
    }

    markAsRead(id: string): Observable<Message> {
        return this.http.put<Message>(`${this.apiUrl}/${id}/read`, {}, { headers: this.getAuthHeaders() });
    }
}
