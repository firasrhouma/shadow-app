import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Iproduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private STORAGE_KEY = 'wishlist'; // key in sessionStorage
  private wishlist: Iproduct[] = [];

  // observables
  private wishlistCountSubject = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistCountSubject.asObservable();

  private wishlistSubject = new BehaviorSubject<Iproduct[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  constructor() {
    this.loadFromSession();
  }

  /** ---------- persistence helpers ---------- */
  private persist() {
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.wishlist));
    } catch (e) {
      console.warn('Could not save wishlist to sessionStorage', e);
    }
    this.wishlistSubject.next([...this.wishlist]);
    this.wishlistCountSubject.next(this.wishlist.length);
  }

  private loadFromSession() {
    try {
      const raw = sessionStorage.getItem(this.STORAGE_KEY);
      this.wishlist = raw ? (JSON.parse(raw) as Iproduct[]) : [];
    } catch (e) {
      console.warn('Could not read wishlist from sessionStorage', e);
      this.wishlist = [];
    }
    this.wishlistSubject.next([...this.wishlist]);
    this.wishlistCountSubject.next(this.wishlist.length);
  }

  /** ---------- public API ---------- */

  addToWishlist(product: Iproduct): Observable<any> {
    const exists = this.wishlist.some((item) => item.id === product.id);
    if (!exists) {
      this.wishlist.push(product);
      this.persist();
    }
    return of({ status: 'success', wishlist: [...this.wishlist] });
  }

  removeFromWishlist(productId: number): Observable<any> {
    this.wishlist = this.wishlist.filter((item) => +item.id !== productId);
    this.persist();
    return of({ status: 'success', wishlist: [...this.wishlist] });
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist.some((item) => +item.id === productId);
  }

  getWishlist(): Observable<any> {
    return of({ status: 'success', wishlist: [...this.wishlist] });
  }

  clearWishlist(): Observable<any> {
    this.wishlist = [];
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.wishlistSubject.next([]);
    this.wishlistCountSubject.next(0);
    return of({ status: 'success', wishlist: [] });
  }
}
