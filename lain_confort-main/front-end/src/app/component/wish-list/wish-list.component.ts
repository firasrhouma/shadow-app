import { Component, inject, OnDestroy } from '@angular/core';
import { WishlistService, Iproduct } from '../../util/services/wishlist.service';
import { BehaviorSubject, Subscription, map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-wish-list',
  imports: [RouterModule, CommonModule, FormsModule, CarouselModule],
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css'],
})
export class WishListComponent implements OnDestroy {
  private wishlistService = inject(WishlistService);
  serverURL = 'http://localhost:4000/uploads/';

  // Reactive wishlist stream → turned into a signal for the template
  wishlistItems = toSignal(
    this.wishlistService.wishlist$.pipe(
      map((wishlist: Iproduct[]) =>
        wishlist.map((product: Iproduct) => ({
          ...product,
          ratingsAverage: this.getRandomRating(),
          images: (product as any).images || [this.serverURL + 'placeholder.png'],
        }))
      )
    ),
    { initialValue: [] } // avoids undefined at init
  );

  carouselOptions = {
    items: 1,
    dots: true,
    nav: false,
    loop: true,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 4000,
    margin: 10,
  };

  wishlistSub: Subscription = new Subscription();
  selectedImageIndex: { [key: number]: number } = {};

  /** -------- Remove item from wishlist -------- */
  removeItem(productId: number): void {
    this.wishlistService.removeFromWishlist(productId).subscribe();
  }

  /** -------- Check if product is in wishlist -------- */
  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  /** -------- Change selected image for carousel -------- */
  changeImage(productId: number, index: number): void {
    this.selectedImageIndex[productId] = index;
  }

  /** -------- Add to cart (mock for now) -------- */
  addToCart(product: Iproduct): void {
    console.log(`Added to cart: ${product.name}`);
  }

  /** -------- Random rating helper -------- */
  getRandomRating(): number {
    const fullStars = Math.floor(Math.random() * 5) + 1;
    const hasHalf = Math.random() < 0.5;
    return hasHalf && fullStars < 5 ? fullStars + 0.5 : fullStars;
  }

  ngOnDestroy(): void {
    this.wishlistSub.unsubscribe();
  }

  getProductImage(id: number): string {
    const imagesMap: { [key: number]: string } = {
      4: 'images/c2.jpg',
    6: 'images/matelat2.jpg',
    7: 'images/pouffe.jpg',
    };
    return imagesMap[id] || this.serverURL + 'placeholder.png';
  }
}
