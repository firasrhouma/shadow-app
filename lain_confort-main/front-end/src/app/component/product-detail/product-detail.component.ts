import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../util/services/product.service';
import { CartService } from '../../util/services/cart.service';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: string | { name?: string } | null;
  images?: string[];
}

type MatelasType = 'entretien' | 'commande';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  options?: any;
  createdAt?: string;
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, CarouselModule, FormsModule]
})
export class ProductDetailComponent implements OnInit {

  productDetails: Product = { id: 0, name: '', description: '', price: 0, images: [], category: undefined };

  isMatelas = false;
  isPouffe = false;

  matelasTypes: MatelasType[] = ['entretien', 'commande'];
  sizes = ['70/190','80/190','90/190','100/190','110/190','120/190','140/190','160/190','170/190','180/190'];

  selectedType: MatelasType = 'entretien';
  selectedSize = '70/190';
  withTissu = false;

  computedPrice = 0;
  quantity = 1; // ⚠ La quantité est utilisée dans le calcul du prix total

  private priceTable: Record<string, { entretien: { sansTissu: number; avecTissu: number }; commande: number }> = {
    '70/190':  { entretien: { sansTissu: 150, avecTissu: 190 }, commande: 270 },
    '80/190':  { entretien: { sansTissu: 180, avecTissu: 220 }, commande: 350 },
    '90/190':  { entretien: { sansTissu: 180, avecTissu: 220 }, commande: 350 },
    '100/190': { entretien: { sansTissu: 200, avecTissu: 240 }, commande: 400 },
    '110/190': { entretien: { sansTissu: 220, avecTissu: 260 }, commande: 470 },
    '120/190': { entretien: { sansTissu: 220, avecTissu: 260 }, commande: 470 },
    '140/190': { entretien: { sansTissu: 280, avecTissu: 380 }, commande: 650 },
    '160/190': { entretien: { sansTissu: 280, avecTissu: 380 }, commande: 750 },
    '170/190': { entretien: { sansTissu: 320, avecTissu: 420 }, commande: 800 },
    '180/190': { entretien: { sansTissu: 320, avecTissu: 420 }, commande: 850 }
  };

  private localCartKey = 'cart';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) this.loadProduct(productId);
  }

  loadProduct(id: string) {
    this.productService.getSpecificProduct(id).subscribe({
      next: (res: Product) => {
        this.productDetails = res;
        const categoryName = this.getCategoryName(res) ?? '';
        this.isMatelas = categoryName.toLowerCase().includes('matel');
        this.isPouffe = categoryName.toLowerCase().includes('pouffe');
        if (this.isMatelas) {
          this.selectedType = 'entretien';
          this.selectedSize = '70/190';
          this.withTissu = false;
        }
        this.computePrice();
      },
      error: err => console.error('Product fetch error:', err)
    });
  }

  private getCategoryName(product: Product): string | null {
    if (!product.category) return null;
    return typeof product.category === 'string' ? product.category : product.category.name ?? null;
  }

  computePrice() {
    if (this.isMatelas) {
      const entry = this.priceTable[this.selectedSize];
      if (!entry) { this.computedPrice = this.productDetails.price; return; }
      this.computedPrice = this.selectedType === 'entretien'
        ? (this.withTissu ? entry.entretien.avecTissu : entry.entretien.sansTissu)
        : entry.commande;
    } else {
      this.computedPrice = this.productDetails.price;
    }
  }

  onOptionChange() { this.computePrice(); }

  private getLocalCart(): CartItem[] {
    try { return JSON.parse(localStorage.getItem(this.localCartKey) ?? '[]'); }
    catch { return []; }
  }

  private saveLocalCart(cart: CartItem[]) {
    localStorage.setItem(this.localCartKey, JSON.stringify(cart));
  }

  private buildOptionLabel(): string {
    if (this.isMatelas) {
      const tissuLabel = this.withTissu ? 'Avec tissu' : 'Sans tissu';
      return `${this.selectedType === 'entretien' ? 'Entretien' : 'Commande'} - ${tissuLabel} - ${this.selectedSize}`;
    }
    if (this.isPouffe && !this.withTissu) return 'Sans tissu';
    return '';
  }

  // ⚡ Correctly calculate total price with quantity
  addToCartWithOptions() {
    const product = this.productDetails;
    const totalPrice = this.computedPrice * this.quantity; // multiplied by quantity
    const optionLabel = this.buildOptionLabel();

    // Pouffe warning
    if (this.isPouffe && !this.withTissu) {
      this.snackBar.open('Attention : Pouffe ajouté sans tissu', 'Close', { duration: 4000, panelClass: ['snackbar-warning'] });
    }

    const composedName = optionLabel ? `${product.name} - ${optionLabel}` : product.name;

    const payload: any = {
      name: composedName,
      price: totalPrice, // total price includes quantity
      quantity: this.quantity,
      options: this.isMatelas ? { type: this.selectedType, size: this.selectedSize, withTissu: this.withTissu } : {}
    };

    // Local cart
    const cart = this.getLocalCart();
    cart.push({
      productId: product.id,
      name: composedName,
      price: totalPrice,
      quantity: this.quantity,
      options: payload.options,
      createdAt: new Date().toISOString()
    });
    this.saveLocalCart(cart);

    // Backend sync
    this.cartService.addToCart(product.id, payload).subscribe({
      next: () => {
        this.snackBar.open('Produit ajouté au panier !', 'Close', { duration: 2500, panelClass: ['snackbar-success'] });
        this.router.navigate(['/cart']);
      },
      error: () => {
        this.snackBar.open('Enregistré localement. Impossible de synchroniser avec le serveur.', 'Close', { duration: 3500, panelClass: ['snackbar-error'] });
      }
    });
  }

  addToCart(product: Product) {
    const totalPrice = product.price * this.quantity; // ⚡ multiply by quantity
    const optionLabel = this.buildOptionLabel();

    // Pouffe warning
    if (this.isPouffe && !this.withTissu) {
      this.snackBar.open('Attention : Pouffe ajouté sans tissu', 'Close', { duration: 4000, panelClass: ['snackbar-warning'] });
    }

    const composedName = optionLabel ? `${product.name} - ${optionLabel}` : product.name;

    const payload: any = {
      name: composedName,
      price: totalPrice,
      quantity: this.quantity,
      options: {}
    };

    const cart = this.getLocalCart();
    cart.push({
      productId: product.id,
      name: composedName,
      price: totalPrice,
      quantity: this.quantity,
      options: {},
      createdAt: new Date().toISOString()
    });
    this.saveLocalCart(cart);

    this.cartService.addToCart(product.id, payload).subscribe({
      next: () => this.snackBar.open('Produit ajouté au panier !', 'Close', { duration: 2500, panelClass: ['snackbar-success'] }),
      error: () => this.snackBar.open('Enregistré localement. Impossible de synchroniser avec le serveur.', 'Close', { duration: 3500, panelClass: ['snackbar-error'] })
    });
    this.router.navigate(['/cart']);
  }

  isCommande(): boolean { return this.selectedType === 'commande'; }

  getProductImage(id: number): string {
    const imagesMap: { [key: number]: string } = { 4: 'images/c2.jpg', 6: 'images/matelat2.jpg', 7: 'images/pouffe.jpg' };
    return imagesMap[id] ?? '';
  }
}
