import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/home/home').then(m => m.Home),
    },
    {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./pages/login/login').then(m => m.Login),
    },
    {
        path: 'category',
        loadComponent: () =>
            import('./pages/category-list/category-list').then(m => m.CategoryList),
    },
    {
        path: 'wishlist',
        loadComponent: () =>
            import('./pages/wishlist/wishlist').then(m => m.Wishlist),
    },
    {
        path: 'profile',
        loadComponent: () =>
            import('./pages/profile/profile').then(m => m.Profile),
    },
    {
        path: 'address',
        loadComponent: () =>
            import('./pages/address/address').then(m => m.Address),
    },
    {
        path: '**',
        redirectTo: ''
    }
];
