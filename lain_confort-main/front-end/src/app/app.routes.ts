import { Routes } from '@angular/router';

import { BlankLayoutComponent } from './layout/blank-layout/blank-layout.component';

import { HomeComponent } from './component/home/home.component';
import { ProductsComponent } from './component/products/products.component';
import { ProductDetailComponent } from './component/product-detail/product-detail.component'; // <- added

import { OrdersComponent } from './component/orders/orders.component';

import { CartComponent } from './component/cart/cart.component';
import { CategoriesComponent } from './component/categories/categories.component';
import { WishListComponent } from './component/wish-list/wish-list.component';
import { ErrorComponent } from './component/error/error.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { ContactUsComponent } from './component/contact-us/contact-us.component';
import { CategoryDetailsComponent } from './component/category-details/category-details.component';

export const routes: Routes = [
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/:id', component: ProductDetailComponent },
      { path: 'categories', component: CategoriesComponent },
     { path: 'categories/:category', component: CategoryDetailsComponent },
      { path: 'cart', component: CartComponent },
      { path: 'wishlist', component: WishListComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'contact-us', component: ContactUsComponent },
    ]
  },
  { path: '**', component: ErrorComponent }
];
