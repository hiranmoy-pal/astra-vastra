import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonProductGrid } from '../common-product-grid/common-product-grid';
@Component({
  selector: 'app-common-product-list-layout',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule, CommonProductGrid],
  templateUrl: './common-product-list-layout.html',
  styleUrl: './common-product-list-layout.scss',
})
export class CommonProductListLayout {
  @Input() title: string = 'Collections';
  @Input() totalCount: number = 0;
  @Input() categories: any[] = [];
  @Input() brands: any[] = [];
  @Input() genders: any[] = [];
  @Input() colors: any[] = [];
  @Input() sizes: any[] = [];
  @Input() ratings: any[] = [];
  @Input() discounts: any[] = [];
  @Input() minPrice: number = 0;
  @Input() maxPrice: number = 20000;
  @Input() maxRange: number = 20000;
  @Input() products: any[] = [];

  @Output() filterChange = new EventEmitter<void>();

  isSortOpen: boolean = false;
  selectedSort: string = 'Popularity';
  sortOptions: string[] = [
    'Popularity',
    'Price: Low to High',
    'Price: High to Low',
    'Recommended',
    'Customer Rating'
  ];

  toggleSort() {
    this.isSortOpen = !this.isSortOpen;
  }


  selectSortOption(option: string) {
    this.selectedSort = option;
    this.isSortOpen = false;
    this.filterChange.emit(); // Triggers API call when sort changes
  }

  

  isFilterOpen: boolean = false;
  selectedDiscount: any;
  selectedCategory: string | null = null;
  selectedBrand: string | null = null;
  selectedRating: number | null = null;
  selectedGender: string | null = null;
  selectedColor: string | null = null;

  toggleSize(size: any) {
    size.selected = !size.selected;
    this.filterChange.emit();
  }

  onMinPriceChange() {
    if (this.minPrice > this.maxPrice - 100) this.minPrice = this.maxPrice - 100;
    this.filterChange.emit();
  }

  onMaxPriceChange() {
    if (this.maxPrice < this.minPrice + 100) this.maxPrice = this.minPrice + 100;
    this.filterChange.emit();
  }

  onFilterUpdate() {
    this.filterChange.emit();
  }
}
