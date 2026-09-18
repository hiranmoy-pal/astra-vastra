import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonProductGrid } from '../common-product-grid/common-product-grid';

@Component({
  selector: 'app-common-product-list-layout',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule, RouterModule, CommonProductGrid],
  templateUrl: './common-product-list-layout.html',
  styleUrl: './common-product-list-layout.scss',
})
export class CommonProductListLayout {
  @Input() title: string = 'Collections';
  @Input() totalCount: number = 0;
  @Input() breadcrumbs: any[] = [];
  @Input() categories: any[] = [];
  @Input() brands: any[] = [];
  @Input() genders: any[] = [];
  @Input() colors: any[] = [];
  @Input() sizes: any[] = [];
  @Input() ratings: any[] = [];
  @Input() discounts: any[] = [];
  @Input() products: any[] = [];

  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;

  @Input() minPrice: number = 0;
  @Output() minPriceChange = new EventEmitter<number>();

  @Input() maxPrice: number = 20000;
  @Output() maxPriceChange = new EventEmitter<number>();

  @Input() maxRange: number = 20000;

  @Input() selectedDiscount: any;
  @Output() selectedDiscountChange = new EventEmitter<any>();

  @Output() filterChange = new EventEmitter<void>();
  @Output() sortChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();

  isFilterOpen: boolean = false;
  isSortOpen: boolean = false;
  selectedSortTitle: string = 'Popularity';

  // Accordion toggle states
  filterStates: { [key: string]: boolean } = {
    category: true,
    brand: true,
    gender: true,
    color: true,
    size: true,
    price: true,
    rating: true,
    discount: true
  };

  sortOptions = [
    { title: "Recommended", value: "recommended" },
    { title: "What's New", value: "whats_new" },
    { title: "Popularity", value: "popularity" },
    { title: "Better Discount", value: "discount" },
    { title: "Price: High to Low", value: "price_desc" },
    { title: "Price: Low to High", value: "price_asc" },
    { title: "Customer Rating", value: "rating" }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  toggleFilter(filterName: string) {
    this.filterStates[filterName] = !this.filterStates[filterName];
  }

  get visiblePages(): number[] {
    const pages = [];
    let start = Math.max(1, this.currentPage - 4);
    let end = Math.min(this.totalPages, start + 9);
    if (end - start < 9) start = Math.max(1, end - 9);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
      // SSR Check to prevent window errors on server
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  toggleSort() {
    this.isSortOpen = !this.isSortOpen;
  }

  selectSortOption(option: any) {
    this.selectedSortTitle = option.title;
    this.isSortOpen = false;
    this.sortChange.emit(option.value);
  }

  toggleSize(size: any) {
    size.selected = !size.selected;
    this.filterChange.emit();
  }

  onMinPriceChange() {
    if (this.minPrice > this.maxPrice - 100) this.minPrice = this.maxPrice - 100;
    this.minPriceChange.emit(this.minPrice);
    this.filterChange.emit();
  }

  onMaxPriceChange() {
    if (this.maxPrice < this.minPrice + 100) this.maxPrice = this.minPrice + 100;
    this.maxPriceChange.emit(this.maxPrice);
    this.filterChange.emit();
  }

  onDiscountChange() {
    this.selectedDiscountChange.emit(this.selectedDiscount);
    this.filterChange.emit();
  }

  onFilterUpdate() {
    this.filterChange.emit();
  }
}