import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, Inject, PLATFORM_ID, NgZone, ViewChild, ElementRef, ChangeDetectorRef, OnChanges, HostListener } from '@angular/core';
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
export class CommonProductListLayout implements OnChanges {
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

  @Input() activeFilters: any[] = [];
  @Output() removeFilter = new EventEmitter<any>();
  @Output() clearFilters = new EventEmitter<void>();

  @Input() isFetchingMore: boolean = false;
  @Input() hasMoreData: boolean = true;
  @Output() scrolledToBottom = new EventEmitter<void>();

  @Input() minPrice: number = 0;
  @Output() minPriceChange = new EventEmitter<number>();

  @Input() maxPrice: number = 20000;
  @Output() maxPriceChange = new EventEmitter<number>();

  @Input() maxRange: number = 20000;

  @Input() selectedDiscount: any;
  @Output() selectedDiscountChange = new EventEmitter<any>();

  @Output() filterChange = new EventEmitter<void>();
  @Output() sortChange = new EventEmitter<string>();

  @ViewChild('gridScrollContainer')
  gridScrollContainer!: ElementRef<HTMLElement>;

  private loadMoreLocked = false;

  isFilterOpen: boolean = false;
  isSortOpen: boolean = false;
  selectedSortTitle: string = 'Recommended';

  filterStates: { [key: string]: boolean } = {
    category: true, brand: true, gender: true, color: true,
    size: true, price: true, rating: true, discount: true
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone) { }

  // 🔥 FIX: TrackBy prevents Angular from destroying and recreating HTML checkboxes on data refresh (Stops the Blinking)
  trackByFn(index: number, item: any): any {
    return item.id || item.name || index;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.isFetchingMore || !this.hasMoreData || this.loadMoreLocked) {
      return;
    }

    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );

    if (documentHeight - scrollPosition <= 800) {
      this.loadMoreLocked = true;
      this.ngZone.run(() => {
        this.scrolledToBottom.emit();
      });
    }
  }

  ngOnChanges(): void {
    if (!this.isFetchingMore) {
      this.loadMoreLocked = false;

      if (!isPlatformBrowser(this.platformId)) return;

      requestAnimationFrame(() => {
        const element = this.gridScrollContainer?.nativeElement;
        if (!element) return;

        const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
        if (distanceFromBottom <= 500 && this.hasMoreData && !this.isFetchingMore && !this.loadMoreLocked) {
          this.loadMoreLocked = true;
          this.ngZone.run(() => {
            this.scrolledToBottom.emit();
          });
        }
      });
    }
  }

  closeMobileFilter() {
    if (isPlatformBrowser(this.platformId) && window.innerWidth <= 768) {
      this.isFilterOpen = false;
    }
  }

  toggleFilter(filterName: string) {
    this.filterStates[filterName] = !this.filterStates[filterName];
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
    this.closeMobileFilter();
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
    this.closeMobileFilter();
  }

  onFilterUpdate() {
    this.filterChange.emit();
    this.closeMobileFilter();
  }
}