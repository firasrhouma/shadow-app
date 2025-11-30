import { Component, inject, Input, OnInit } from '@angular/core';
import { ProductService } from '../../util/services/product.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { WishlistService } from '../../util/services/wishlist.service';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../util/services/cart.service';
import { Router } from '@angular/router';
export interface Iproduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: string | null;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, CarouselModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  @Input() productListLength: number = 0;

  productList: Iproduct[] = [];
  filteredProductList: Iproduct[] = [];
  searchQuery: string = '';
  randomIndexesOfProducts: number[] = [];

  serverURL = 'http://localhost:4000/uploads/';

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

  private wishlistService = inject(WishlistService);
  private productService = inject(ProductService);
  private readonly loadData$ = new BehaviorSubject(true);
  wishlistItems = toSignal(this.loadWhishList);

  constructor(
    private snackBar: MatSnackBar,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  /** ----------- PRODUCTS ------------ */
loadProducts(): void {
  this.productService.getAllProducts().subscribe({
    next: (res) => {
      this.productList = res.map((product: Iproduct) => ({
        ...product,
        category: product.category ?? 'Uncategorized',

      }));

      this.filteredProductList = [...this.productList];
      this.getRandomIndexesOfProducts(this.productList);
    },
    error: (err) => console.error('Error loading products:', err),
  });
}
  getProductImage(id: number): string {
  const imagesMap: { [key: number]: string } = {
    4: 'images/c2.jpg',
    6: 'images/matelat2.jpg',
    7: 'images/pouffe.jpg',
  };
  return imagesMap[id] ; // fallback image
}



filterProducts(): void {
  if (this.searchQuery.trim() === '') {
    // Reset to all products
    this.filteredProductList = [...this.productList];
  } else {
    this.filteredProductList = this.productList.filter((product) =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  this.getRandomIndexesOfProducts(this.filteredProductList);
}

  onSearchChange(): void {
    this.filterProducts();
  }

  getRandomIndexesOfProducts(productList: Iproduct[]) {
    this.randomIndexesOfProducts = [];
    const count =
      productList.length > 12 && location.pathname === '/home'
        ? 12
        : productList.length;

    while (this.randomIndexesOfProducts.length < count) {
      const randomNum = Math.floor(Math.random() * productList.length);
      if (!this.randomIndexesOfProducts.includes(randomNum)) {
        this.randomIndexesOfProducts.push(randomNum);
      }
    }
  }



/** ----------- WISHLIST ------------ */
get loadWhishList() {
  return this.wishlistService.wishlist$.pipe(
    map((wishlist) =>
      wishlist.map((product) => ({
        ...product,
        ratingsAverage: this.getRandomRating(),
        images: (product as any).images || [this.serverURL + 'placeholder.png'],
      }))
    )
  );
}

  toggleWishlist(product: Iproduct): void {
    if (this.isItemInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
    } else {
      this.addToWishlist(product);
    }
  }

  isItemInWishlist(id: number): boolean {
    return this.wishlistService.isInWishlist(id);
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => this.loadData$.next(true),
      error: (err) => console.error('Error removing item:', err),
    });
  }

addToWishlist(product: Iproduct): void {
  this.wishlistService.addToWishlist(product).subscribe({
    next: () => this.loadData$.next(true),
    error: (err) => console.error('Error adding item:', err),
  });
}


  goToProduct(productId: number) {
    this.router.navigate(['/products', productId]);
  }
  /** -------- Random rating helper -------- */
getRandomRating(): number {
  const fullStars = Math.floor(Math.random() * 5) + 1;
  const hasHalf = Math.random() < 0.5;
  return hasHalf && fullStars < 5 ? fullStars + 0.5 : fullStars;
}

}


