import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../util/services/cart.service';
import { environment } from '../../util/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  OrderForm!: FormGroup;
  cartItems: CartItem[] = [];
  posting = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

 private orderApiUrl = environment.orderApiUrl;
  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.OrderForm = this.fb.group({
      details: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{6,20}$/)]],
      region: ['', Validators.required],
      address: ['']
    });

    const regionCtrl = this.OrderForm.get('region')!;
    const addrCtrl = this.OrderForm.get('address')!;

    this.subs.add(
      regionCtrl.valueChanges.subscribe(regionValue => {
        if (regionValue) {
          addrCtrl.setValidators([Validators.required, Validators.minLength(5)]);
        } else {
          addrCtrl.clearValidators();
          addrCtrl.setValue('');
        }
        addrCtrl.updateValueAndValidity();
      })
    );

    // Load cart from sessionStorage
    try {
      const raw = sessionStorage.getItem('cart');
      this.cartItems = raw ? JSON.parse(raw) as CartItem[] : [];
    } catch (e) {
      console.warn('Could not parse cart from sessionStorage', e);
      this.cartItems = [];
    }

    this.subs.add(
      this.cartService.cart$.subscribe(items => {
        this.cartItems = items ?? [];
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private computeTotalFromItems(items: { price: number; quantity: number }[]): number {
    return items.reduce((s, it) => s + (it.price * it.quantity), 0);
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.OrderForm.invalid) {
      this.OrderForm.markAllAsTouched();
      return;
    }

    if (!this.cartItems.length) {
      this.errorMessage = 'Votre panier est vide.';
      return;
    }

    const { details, phone } = this.OrderForm.value;
    const region = this.OrderForm.get('region')!.value;
    const addressInput = this.OrderForm.get('address')!.value || '';
    const finalAddress = `${region}, ${addressInput}`.trim();

    // Build payloads with total instead of price
    const payloads = this.cartItems.map(item => {
      const itAny = item as any;
      const quantity = Number(itAny.quantity ?? 1);
      const price = Number(itAny.price ?? 0);
      return {
        productName: itAny.name ?? itAny.title ?? 'Produit',
        quantity,
        price: price * quantity, // ✅ total
        phoneNumber: phone,
        address: finalAddress,
        clientName: details
      };
    });

    console.log('ORDER PAYLOADS ->', JSON.stringify(payloads, null, 2));

    this.posting = true;

  const requests = payloads.map(p =>
  this.http.post<any>(`${this.orderApiUrl}`, p, { responseType: 'text' as 'json' }).pipe(
    catchError(err => of({ __error: true, payload: p, err }))
  )
);


    forkJoin(requests).subscribe({
      next: results => {
      const savedOrders: any[] = results.map(res => {
  if (res && (res as any).__error) {
    const p = (res as any).payload;
    return {
      _id: 'local-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      order_details: {
        clientName: p.clientName,
        phone: p.phoneNumber,
        address: p.address,
        products: [{ title: p.productName, quantity: p.quantity, price: p.price }]
      },
      total: p.price
    };
  }

  const so = res as any;
  const id = so.id ?? so._id ?? 'server-' + Date.now();
  return {
    _id: id,
    order_details: {
      clientName: so.clientName ?? details,
      phone: so.phoneNumber ?? phone,
      address: so.address ?? finalAddress,
      products: [{ title: so.productName ?? 'Produit', quantity: so.quantity, price: so.price }]
    },
    total: so.price
  };
});


        // Save to sessionStorage
        try {
          const raw = sessionStorage.getItem('orders');
          let ordersArr: any[] = raw ? JSON.parse(raw) : [];
          if (!Array.isArray(ordersArr)) ordersArr = [];
          savedOrders.reverse().forEach(o => ordersArr.unshift(o));
          sessionStorage.setItem('orders', JSON.stringify(ordersArr));
        } catch (e) {
          console.warn('Could not save orders to sessionStorage', e);
        }

        // Clear cart
        this.subs.add(
          this.cartService.clearCart().subscribe({
            next: () => {
              sessionStorage.removeItem('cart');
              this.posting = false;
              this.successMessage = 'Commande(s) passée(s) avec succès !';
              this.router.navigate(['/orders']);
            },
            error: () => {
              sessionStorage.removeItem('cart');
              this.posting = false;
              this.successMessage = 'Commande(s) passée(s) avec succès !';
              this.router.navigate(['/orders']);
            }
          })
        );
      },
      error: () => {
        this.posting = false;
        this.errorMessage = 'Erreur lors de l\'envoi des commandes. Réessaie plus tard.';
      }
    });
  }
}
