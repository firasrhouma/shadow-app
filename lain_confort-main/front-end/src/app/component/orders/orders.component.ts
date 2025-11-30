import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  serverURL = 'http://localhost:4000/uploads/'; // optional if you want product images

  private readonly _Router = inject(Router);

  ngOnInit(): void {
    this.loadOrders();
  }

  /** Load orders from sessionStorage */
  loadOrders(): void {
    const raw = sessionStorage.getItem('orders');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        this.orders = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.warn('Failed to parse orders from sessionStorage', e);
        this.orders = [];
      }
    } else {
      this.orders = [];
    }
  }

  /** Compute total of a specific order or all orders */
  total(order?: any): number {
    if (order) {
      return order.order_details.products.reduce(
        (sum: number, p: any) => sum + ((p.price ?? 0) * (p.quantity ?? 1)),
        0
      );
    }
    return this.orders.reduce(
      (sum, o) =>
        sum +
        o.order_details.products.reduce(
          (s: number, p: any) => s + ((p.price ?? 0) * (p.quantity ?? 1)),
          0
        ),
      0
    );
  }

  /** Delete a specific order */
  deleteSpecificProduct(orderId: string): void {
    this.orders = this.orders.filter(o => o._id !== orderId);
    sessionStorage.setItem('orders', JSON.stringify(this.orders));
  }

  /** Delete all orders */
  deleteAllOrders(): void {
    this.orders = [];
    sessionStorage.removeItem('orders');
    this._Router.navigate(['/home']);
  }

  /** Get product image */
/** Get product image based on id or name */
getProductImage(item: any): string {
  // Fallback images map
  const imagesMap: { [key: number]: string } = {
    4: 'images/c2.jpg',       // id 4
    6: 'images/matelat2.jpg', // id 6
    7: 'images/pouffe.jpg'    // id 7
  };

  // Try to get ID first
  const id = Number(item._id ?? item.id ?? item.productId ?? 0);

  if (imagesMap[id]) return imagesMap[id];

  // Otherwise, check title/ name keywords
  const title: string = (item.title ?? item.name ?? '').toLowerCase();

  if (title.includes('matelas')) return imagesMap[6];
  if (title.includes('poof') || title.includes('pouffe')) return imagesMap[7];
  if (title.includes('coussin')) return imagesMap[4];

  // Default fallback
  return '/assets/default-product.png';
}

}
