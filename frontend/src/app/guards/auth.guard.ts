import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const token = localStorage.getItem('admin_token');

    if (token === 'admin-secret-token') {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};
