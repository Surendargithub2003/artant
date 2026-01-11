import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
    _id?: string;
    clientName: string;
    contactInfo: string;
    artworkTitle: string;
    totalAmount: number;
    advanceAmount: number;
    status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
    notes: string;
    createdAt?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    // Dynamically set API URL based on environment
    private apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api/orders'
        : 'https://YOUR-BACKEND-APP-NAME.onrender.com/api/orders';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Authorization': 'admin-secret-token'
        });
    }

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiUrl, { headers: this.getAuthHeaders() });
    }

    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(this.apiUrl, order, { headers: this.getAuthHeaders() });
    }

    updateOrder(id: string, order: Partial<Order>): Observable<Order> {
        return this.http.put<Order>(`${this.apiUrl}/${id}`, order, { headers: this.getAuthHeaders() });
    }

    deleteOrder(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }
}
