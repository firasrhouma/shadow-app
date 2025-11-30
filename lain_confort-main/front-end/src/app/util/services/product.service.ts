import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('userToken='))
    ?.split('=')[1];

  headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  private productApiUrl = environment.productApiUrl;

getAllProducts(): Observable<any> {
  return this.http.get(`${environment.productApiUrl}`, { headers: this.headers });
}

getSpecificProduct(id: string): Observable<any> {
  return this.http.get(`${environment.productApiUrl}/${id}`, { headers: this.headers });
}

}






