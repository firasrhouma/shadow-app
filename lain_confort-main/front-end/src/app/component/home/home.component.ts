import { Component } from '@angular/core';
import { SliderMainComponent } from '../slider-main/slider-main.component';
import { SliderCategoryComponent } from '../slider-category/slider-category.component';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-home',
  imports: [SliderMainComponent, SliderCategoryComponent, ProductComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
