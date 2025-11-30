import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../util/services/category.service';
import { Icategory } from '../../util/interfaces/icategory';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [RouterModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private CategoryService = inject(CategoryService);
  categoryList: Icategory[] = [];

  ngOnInit(): void {
    this.CategoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryList = res; // ✅ now directly an array
      },
      error: (error) => {
        console.log('❌ Error loading categories:', error);
      },
    });
  }
}
