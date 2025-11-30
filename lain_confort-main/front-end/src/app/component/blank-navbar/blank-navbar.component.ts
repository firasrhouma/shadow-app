import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../../util/services/cart.service';
import { WishlistService } from '../../util/services/wishlist.service';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../../util/interfaces/iproduct';
import { toSignal } from '@angular/core/rxjs-interop';  // ✅ Import this

@Component({
  selector: 'app-blank-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './blank-navbar.component.html',
  styleUrls: ['./blank-navbar.component.css'],
})
export class BlankNavbarComponent implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  isAdmin: boolean = false;
  cartCount: number = 0;
  wishListCounter: number = 0;

  private subscriptions = new Subscription();

  // ✅ Declare as component properties
  wishlistItems = toSignal(this.wishlistService.wishlist$, { initialValue: [] });
  cartItems = toSignal(this.cartService.cart$, { initialValue: [] });

  token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('userToken='))
    ?.split('=')[1];

  ngOnInit(): void {
    // Decode token
    if (this.token) {
      const user = jwtDecode<DecodedToken>(this.token);
      this.isAdmin = user.role === 'admin';
    }

    // Subscribe to cart count
    this.subscriptions.add(
      this.cartService.cartCount$.subscribe(count => {
        this.cartCount = count;
      })
    );

    // Subscribe to wishlist count
    this.subscriptions.add(
      this.wishlistService.wishlistCount$.subscribe(count => {
        this.wishListCounter = count;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
