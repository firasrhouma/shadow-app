import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor() {}

  // Hardcoded list of categories (can include products inside too)
  private categories = [
    {
      name: 'Matelas',
      _id: '1',
      image: 'images/newmatelat.jpg',
    },
    {
      name: 'Coussin',
      _id: '2',
      image: 'images/c2.jpg',

    },
    {
       name: 'Pouffe',
      _id: '2',
      image: 'images/pouffe.jpg',
    }
  ];

  // Simulate getting all categories
  getAllCategories(): Observable<any[]> {
    return of(this.categories);
  }

}
