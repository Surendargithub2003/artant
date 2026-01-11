import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api/auth'
        : 'https://YOUR-BACKEND-APP-NAME.onrender.com/api/auth';

    constructor(private http: HttpClient) { }

    login(password: string): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { password })
            .pipe(
                tap(response => {
                    if (response.token) {
                        localStorage.setItem('admin_token', response.token);
                    }
                })
            );
    }

    logout() {
        localStorage.removeItem('admin_token');
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('admin_token');
    }
}
