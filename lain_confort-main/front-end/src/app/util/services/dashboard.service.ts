import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  getToken() {
    return new HttpHeaders().set(
      'Authorization',
      `Bearer ${
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('userToken='))
          ?.split('=')[1]
      }`
    );
  }

  getAllAdminProducts(): Observable<any> {
    return this.http.get(`https://ecommerceapi-production-8d5f.up.railway.app/api/dashboard`, {
      headers: this.getToken(),
    });
  }

  getproductById(id: string): Observable<any> {
    return this.http.get(`https://ecommerceapi-production-8d5f.up.railway.app/api/product/${id}`, {
      headers: this.getToken(),
    });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`https://ecommerceapi-production-8d5f.up.railway.app/api/product/${id}`, {
      headers: this.getToken(),
    });
  }

  addProduct(product: any): Observable<any> {
    product.append('sold', '0');

    return this.http.post(`https://ecommerceapi-production-8d5f.up.railway.app/api/product`, product, {
      headers: this.getToken(),
    });
  }

  updateProduct(id: string, productFormData: FormData): Observable<any> {
    return this.http.patch(
      `https://ecommerceapi-production-8d5f.up.railway.app/api/product/${id}`,
      productFormData,
      {
        headers: this.getToken(),
      }
    );
  }

  getAllAdminOrders(adminID: string): Observable<any> {
    return this.http.get(`https://ecommerceapi-production-8d5f.up.railway.app/api/order/admin/${adminID}`, {
      headers: this.getToken(),
    });
  }
  completedOrder(orderID: string): Observable<any> {
    return this.http.get(`https://ecommerceapi-production-8d5f.up.railway.app/api/ordercomplate/${orderID}`, {
      headers: this.getToken(),
    });
  }

  getAllAdminCustomers(adminID: string): Observable<any> {
    return this.http.get(`https://ecommerceapi-production-8d5f.up.railway.app/api/customer/${adminID}`, {
      headers: this.getToken(),
    });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`https://ecommerceapi-production-8d5f.up.railway.app/api/user/${id}`, {
      headers: this.getToken(),
    });
  }

  addCategory(data: any): Observable<any> {
    return this.http.post(`https://ecommerceapi-production-8d5f.up.railway.app/api/categories`, data, {
      headers: this.getToken(),
    });
  }
}
