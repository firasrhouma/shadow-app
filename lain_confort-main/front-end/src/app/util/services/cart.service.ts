// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface CartItem {
  productId: string | number;
  name?: string;
  price?: number;
  image?: string;
  quantity: number;
  // ajoute d'autres champs si besoin
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private STORAGE_KEY = 'cart';
  private cartProducts: CartItem[] = [];

  // observable pour le nombre total d'articles (sum des quantities)
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  // observable pour le contenu du panier (utile pour UI reactive)
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadFromSession();
  }

  /** ---------- persistence helpers ---------- */
  private persist() {
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartProducts));
    } catch (e) {
      console.warn('Could not save cart to sessionStorage', e);
    }
    this.cartSubject.next([...this.cartProducts]);
    this.updateCartCount(this.cartProducts);
  }

  private loadFromSession() {
    try {
      const raw = sessionStorage.getItem(this.STORAGE_KEY);
      this.cartProducts = raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch (e) {
      console.warn('Could not read cart from sessionStorage', e);
      this.cartProducts = [];
    }
    this.cartSubject.next([...this.cartProducts]);
    this.updateCartCount(this.cartProducts);
  }

  /** ---------- public API (same logic/names as before) ---------- */

 // CartService
addToCart(productId: number | string, optionalProductData?: Partial<CartItem>): Observable<any> {
  const existing = this.cartProducts.find(p => p.productId === productId);

  if (existing) {
    existing.quantity += 1; // Increment quantity if product exists
  } else {
    const newItem: CartItem = {
      productId,
      name: optionalProductData?.name || 'Unknown',
      price: optionalProductData?.price || 0,
           quantity: 1
    };
    this.cartProducts.push(newItem);
  }

  this.persist(); // Save cart to localStorage or server

  // Keep response shape similar to backend for UI consistency
  return of({ status: 'success', cart: { products: [...this.cartProducts] } });
}

  // getCart() - retourne le panier actuel
  getCart(): Observable<any> {
    return of({ status: 'success', cart: { products: [...this.cartProducts] } }).pipe(
      tap(response => {
        if (response?.cart?.products) {
          this.updateCartCount(response.cart.products);
        }
      })
    );
  }

  // updateQuantity(productId, quantity)
  updateQuantity(productId: string | number, quantity: number): Observable<any> {
    const idx = this.cartProducts.findIndex(p => p.productId === productId);
    if (idx > -1) {
      if (quantity <= 0) {
        this.cartProducts.splice(idx, 1);
      } else {
        this.cartProducts[idx].quantity = quantity;
      }
      this.persist();
    }
    return of({ status: 'success', cart: { products: [...this.cartProducts] } });
  }

  // removeProduct(productId)
// removeProduct(productId)
removeProduct(productId: string | number): void {
  // 1. Get current cart
  const cartStr = localStorage.getItem('productCart');
  let cart: CartItem[] = cartStr ? JSON.parse(cartStr) : [];

  // 2. Remove selected product
  cart = cart.filter((p: CartItem) => p.productId !== productId);

  // 3. Save back to localStorage
  localStorage.setItem('productCart', JSON.stringify(cart));

  // 4. Update service state
  this.cartProducts = cart;

  // 5. Update counter
  this.updateCartCount(cart);
}

private updateCartCount(products: CartItem[]): void {
  const totalQuantity = products.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );
  this.cartCountSubject.next(totalQuantity);
}


  // clearCart()
  clearCart(): Observable<any> {
    this.cartProducts = [];
    this.persist();
    return of({ status: 'success', cart: { products: [] } });
  }

  // applyCoupon(code) - simple front-end demo (adapte selon besoin)
  applyCoupon(code: string): Observable<any> {
    if (!code) {
      return of({ status: 'error', message: 'No coupon provided' });
    }
    if (code === 'DISCOUNT10') {
      // simple demo: return success with coupon info (UI should apply discount logic)
      return of({ status: 'success', message: 'Coupon applied', coupon: { code, discountPercent: 10 }});
    }
    return of({ status: 'error', message: 'Invalid coupon' });
  }


}
