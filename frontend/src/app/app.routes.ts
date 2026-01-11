import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { LoginComponent } from './components/login/login';
import { authGuard } from './guards/auth.guard';
import { AboutComponent } from './components/about/about';
import { ContactComponent } from './components/contact/contact';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'art/:id', component: ProductDetailComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard] },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: '**', redirectTo: '' }
];
