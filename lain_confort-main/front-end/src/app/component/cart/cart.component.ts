import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../util/services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../util/services/product.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  // ----- CartComponent properties (single declarations only) -----
  products: any[] = [];
  totalCheckout: number = 0;

  subtotal: number = 0;
  shipping: number = 0;        // default shipping
  taxRate: number = 0;         // e.g. 0.07 for 7% VAT

  discountAmount: number = 0;

  couponCode: string = '';
  couponApplied: boolean = false;
  couponMessage: string = '';
  couponDetails: any = null;

  isLoading: boolean = true;
  productDetails: any = { images: [], category: null };

  localStorageRef = localStorage;
  JSONRef = JSON;
  // ---------------------------------------------------------------

  cartCount: number = 0;
  private subscriptions = new Subscription();

  serverURL = 'http://localhost:4000/uploads/';

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {}

  private round2(val: number) {
    return Math.round((val + Number.EPSILON) * 100) / 100;
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
    this.loadCart();
  }

  loadProduct(id: string) {
    this.productService.getSpecificProduct(id).subscribe({
      next: (res) => this.productDetails = res,
      error: (err) => console.error('Product fetch error:', err)
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private updateLocalStorage() {
    try {
      localStorage.setItem('productCart', JSON.stringify(this.products));
    } catch (e) {
      console.warn('Failed to update localStorage', e);
    }
  }

  loadCart() {
    this.isLoading = true;
    this.cartService.getCart().subscribe(
      (response) => {
        if (response.status === 'success') {
          // expecting response.cart.products to be an array of items like { productId: {...}, quantity, price?, name? }
          this.products = response.cart.products || [];
          this.calcTotals();
          this.updateLocalStorage();
        } else {
          // fallback: try to read from localStorage if server returned no cart
          const ls = localStorage.getItem('productCart');
          this.products = ls ? JSON.parse(ls) : [];
          this.calcTotals();
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Failed to load cart:', error);
        // fallback to localStorage
        const ls = localStorage.getItem('productCart');
        this.products = ls ? JSON.parse(ls) : [];
        this.calcTotals();
        this.isLoading = false;
      }
    );
  }

  increaseQuantity(productId: string) {
    const item = this.products.find(p => (p.productId && p.productId._id ? p.productId._id : p.productId) === productId);
    if (item) {
      item.quantity = Number(item.quantity || 0) + 1;
      this.updateQuantityInCart(productId, item.quantity);
    }
  }

  decreaseQuantity(productId: string) {
    const item = this.products.find(p => (p.productId && p.productId._id ? p.productId._id : p.productId) === productId);
    if (item && item.quantity > 1) {
      item.quantity = Number(item.quantity || 0) - 1;
      this.updateQuantityInCart(productId, item.quantity);
    }
  }

  updateQuantityInCart(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity).subscribe(
      (response) => {
        if (response.status === 'success') {
          // reload cart from server to keep consistency
          this.loadCart();
        } else {
          // if server failed, keep local change and recalc
          this.calcTotals();
          this.updateLocalStorage();
        }
      },
      (error) => {
        console.error('Failed to update quantity:', error);
        // do conservative local update so UI stays responsive
        this.calcTotals();
        this.updateLocalStorage();
      }
    );
  }

  deleteProduct(productId: string) {
    try {
      // productId may be id string or embedded object; ensure we pass an id string
      this.cartService.removeProduct(productId); // your service apparently doesn't return observable
      // locally remove and recalc to give immediate feedback
      this.products = this.products.filter(p => {
        const id = (p.productId && p.productId._id) ? p.productId._id : p.productId;
        return id !== productId;
      });
      this.calcTotals();
      this.updateLocalStorage();

      this.snackBar.open('Product deleted successfully', 'close', {
        duration: 4000,
        panelClass: ['custom-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
    } catch (error) {
      this.snackBar.open('Failed to delete product', 'close', {
        duration: 4000,
        panelClass: ['custom-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
      console.error('Failed to remove product:', error);
    }
  }

  calcTotals() {
    // compute subtotal
    this.subtotal = this.products.reduce((acc, item) => {
      const price = Number(item?.productId?.price ?? item?.price ?? 0);
      const qty = Number(item?.quantity ?? 0);
      const line = price * qty;
      return acc + (isFinite(line) ? line : 0);
    }, 0);
    this.subtotal = this.round2(this.subtotal);

    // compute discount (if couponDetails provided)
    if (this.couponApplied && this.couponDetails) {
      const d = this.couponDetails.discount ?? 0;
      const type = (this.couponDetails.discountType ?? 'fixed').toLowerCase();
      if (type === 'percent') {
        this.discountAmount = this.round2((this.subtotal * d) / 100);
      } else {
        this.discountAmount = this.round2(d);
      }
    } else if (!this.couponApplied) {
      this.discountAmount = 0;
    }

    // taxes
    const tax = this.round2((this.subtotal - this.discountAmount) * (this.taxRate || 0));

    // final total
    const total = this.subtotal - this.discountAmount + (this.shipping || 0) + tax;
    this.totalCheckout = this.round2(Math.max(0, total));

    // persist totals along with cart
    if (typeof (this as any).updateLocalStorage === 'function') {
      (this as any).updateLocalStorage();
    }

    // debug logs (remove in production)
    // console.log('calcTotals:', { subtotal: this.subtotal, discountAmount: this.discountAmount, tax, shipping: this.shipping, totalCheckout: this.totalCheckout });
  }

  clearCart() {
    this.cartService.clearCart().subscribe(
      (response) => {
        if (response.status === 'success') {
          this.products = [];
          this.subtotal = 0;
          this.discountAmount = 0;
          this.couponApplied = false;
          this.couponCode = '';
          this.couponDetails = null;
          this.shipping = 0;
          this.totalCheckout = 0;
          if (typeof (this as any).updateLocalStorage === 'function') {
            (this as any).updateLocalStorage();
          }
        }
      },
      (error) => {
        console.error('Failed to clear cart:', error);
      }
    );
  }

  handelcoupon() {
    if (!this.couponCode || !this.couponCode.trim()) {
      this.couponMessage = 'Please enter a coupon code.';
      this.couponApplied = false;
      this.couponDetails = null;
      this.discountAmount = 0;
      this.calcTotals();
      return;
    }

    this.calcTotals();

    this.cartService.applyCoupon(this.couponCode.trim()).subscribe(
      (response) => {
        if (response.status === 'success') {
          if (response.coupon) {
            this.couponDetails = response.coupon;
            this.couponApplied = true;
            this.couponMessage = response.message || 'Coupon applied successfully!';
            this.calcTotals();
          } else if (typeof response.newTotal === 'number') {
            this.couponApplied = true;
            this.couponDetails = null;
            // fallback estimate of discount
            const estimatedDiscount = this.round2(this.subtotal - response.newTotal + (this.shipping || 0));
            this.discountAmount = Math.min(Math.max(estimatedDiscount, 0), this.subtotal);
            this.totalCheckout = this.round2(response.newTotal);
            this.couponMessage = response.message || 'Coupon applied successfully!';
            if (typeof (this as any).updateLocalStorage === 'function') (this as any).updateLocalStorage();
          } else if (typeof response.discount === 'number') {
            this.couponDetails = {
              discount: response.discount,
              discountType: response.discountType ?? 'fixed',
            };
            this.couponApplied = true;
            this.couponMessage = response.message || 'Coupon applied successfully!';
            this.calcTotals();
          } else {
            this.couponApplied = false;
            this.couponDetails = null;
            this.couponMessage = response.message || 'Coupon applied but no discount returned.';
            this.calcTotals();
          }
        } else {
          this.couponApplied = false;
          this.couponDetails = null;
          this.discountAmount = 0;
          this.couponMessage = response.message || 'Invalid coupon.';
          this.calcTotals();
        }
      },
      (error) => {
        console.error('Failed to apply coupon:', error);
        this.couponApplied = false;
        this.couponDetails = null;
        this.discountAmount = 0;
        this.couponMessage = 'Invalid coupon code. Please try again';
        this.calcTotals();
      }
    );
  }

  getProductImage(item: any): string {
    // item may be productId object or id. Try multiple fallbacks.
    const productObj = item?.productId ?? item;
    if (!productObj) return '/assets/default-product.png';
    // if productObj has images array use first, else try mapped ids
    if (Array.isArray(productObj.images) && productObj.images.length) {
      return this.serverURL + productObj.images[0];
    }
    // fallback mapping for numeric ids (if you used before)
    const imagesMap: { [key: number]: string } = {
      4: 'images/c2.jpg',
    6: 'images/matelat2.jpg',
    7: 'images/pouffe.jpg',
    };
    const id = Number(productObj._id ?? productObj);
    return imagesMap[id] ?? '/assets/default-product.png';
  }
}
