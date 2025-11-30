import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../util/services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { environment } from '../../util/environment';
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string; // make sure backend provides this
  images?: string[];
}

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [CommonModule, CarouselModule, RouterModule],
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css'],
})
export class CategoryDetailsComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor(
    private snackBar: MatSnackBar,
    private cartService: CartService,
    private route: ActivatedRoute,

  ) {}

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

  categoryList: Product[] = [];

  ngOnInit(): void {
    const categoryName = this.route.snapshot.paramMap.get('category'); // "Matelas"

    this.loadProducts().subscribe({
      next: (products) => {
        const images = [
          'images/matelat1.jpeg',
          'images/matelat2.jpg',
          'images/c2.jpg',
          'images/masned.webp',
          'images/pouffe.jpg'
        ];

        // Filter products by category
        const filteredProducts = products.filter(p => p.category === categoryName);

        this.categoryList = filteredProducts.map((p, index) => ({
          ...p,
          images: [images[index % images.length]]  // cycle through images
        }));
      },
      error: (err) => console.error('Error loading products', err),
    });
  }

loadProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(environment.productApiUrl);
}

  goToProduct(productId: number) {
    this.router.navigate(['/products', productId]);
  }

  /** ----------- CART ------------ */
  addToCart(product: Product) {
    this.cartService.addToCart(product.id, {
      name: product.name,
      price: product.price
    }).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.snackBar.open('Product added to cart!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
          this.router.navigate(['/cart']);
        }
      },
      error: (error) => {
        if (error.error?.message === 'Product already in cart') {
          this.snackBar.open('Product is already in your cart!', 'Close', {
            duration: 4000,
            panelClass: ['snackbar-warning'],
          });
        } else {
          this.snackBar.open('Something went wrong!', 'Close', {
            duration: 4000,
            panelClass: ['snackbar-error'],
          });
          console.error('Add to cart error:', error);
        }
      },
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
}
