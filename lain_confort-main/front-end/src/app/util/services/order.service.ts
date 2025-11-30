import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrder } from '../interfaces/order';
import { environment } from '../environment'; // make sure path is correct
import { jwtDecode } from 'jwt-decode'; // use default import

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly _HttpClient = inject(HttpClient);

  constructor() { }

  createOrder(body: IOrder): Observable<any> {
    const token = document.cookie.split('=')[1];
    const user: { userID: string } = jwtDecode(token);
    return this._HttpClient.post(
      `${environment.orderApiUrl}`, // changed from baseUrl
      { ...body, userId: user.userID },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  getOrders(): Observable<any> {
    const token = document.cookie.split('=')[1];
    const user: { userID: string } = jwtDecode(token);
    return this._HttpClient.get(
      `${environment.orderApiUrl}/${user.userID}`, // changed
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  deleteAllOrders(): Observable<any> {
    const token = document.cookie.split('=')[1];
    const user: { userID: string } = jwtDecode(token);
    return this._HttpClient.delete(
      `${environment.orderApiUrl}/delete/${user.userID}`, // changed
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  deleteSpecificOrder(orderId: string | undefined): Observable<any> {
    const token = document.cookie.split('=')[1];
    return this._HttpClient.delete(
      `${environment.orderApiUrl}/delete/${orderId}`, // changed
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}
