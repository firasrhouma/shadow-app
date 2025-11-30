import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CategoryService } from '../../util/services/category.service';
import { Icategory } from '../../util/interfaces/icategory';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-slider-category',
  standalone: true,
  imports: [CarouselModule, RouterModule],
  templateUrl: './slider-category.component.html',
  styleUrl: './slider-category.component.css',
})
export class SliderCategoryComponent implements OnInit {
  categoryOptions: OwlOptions = {
    loop: false,             // disable continuous looping
    autoplay: false,         // turn off autoplay
    dots: false,             // hide pagination dots
    nav: false,              // hide next/prev buttons
    mouseDrag: true,         // allow manual dragging
    touchDrag: true,         // allow touch dragging
    pullDrag: false,
    smartSpeed: 0,           // no transition animation
    navSpeed: 0,             // instantaneous nav if you re-enable it
    responsive: {
      0:   { items: 1 },
      400: { items: 2 },
      740: { items: 3 },
      940: { items: 5 },
    },
  };

  private CategoryService = inject(CategoryService);
  categoryList: Icategory[] = [];

  ngOnInit(): void {
    this.CategoryService.getAllCategories().subscribe({
      next: (res) => (this.categoryList = res),
      error: (error) =>
        console.error(
          'Error loading categories:',
          error
        ),
    });
  }
}
