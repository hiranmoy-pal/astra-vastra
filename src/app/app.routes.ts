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
        path: 'shop/:slug',
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
        path: 'product-review',
        loadComponent: () =>
            import('./pages/produt-review/produt-review').then(m => m.ProdutReview),
    },
    {
        path: 'ordered-list',
        loadComponent: () =>
            import('./pages/ordered-list/ordered-list').then(m => m.OrderedList),
    },
    {
        path: 'cart',
        loadComponent: () =>
            import('./pages/cart/cart').then(m => m.Cart),
    },
    {
        path: 'order-details',
        loadComponent: () =>
            import('./pages/order-details/order-details').then(m => m.OrderDetails),
    },
    {
        path: 'checkout',
        loadComponent: () =>
            import('./pages/order-place-checkout/order-place-checkout').then(m => m.OrderPlaceCheckout),
    },
    {
        path: 'product-details',
        loadComponent: () =>
            import('./pages/product-details/product-details').then(m => m.ProductDetails),
    },
    {
        path: ':slug',
        loadComponent: () =>
            import('./pages/product-list/product-list').then(m => m.ProductList),
    },
    {
        path: '**',
        redirectTo: ''
    }
];
