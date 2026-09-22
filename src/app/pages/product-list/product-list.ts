import { AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, NgZone, OnInit } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ProfileMenu } from '../../layout/profile-menu/profile-menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonProductListLayout } from '../../layout/common-product-list-layout/common-product-list-layout';
import { Http } from '../../core/services/api/http';
import { Loading } from '../../core/services/loading/loading';

@Component({
  selector: 'app-product-list',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink, ProfileMenu, FormsModule, ReactiveFormsModule, CommonProductListLayout
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit, AfterViewInit {

  slug: string = '';
  categoryTitle: string = 'Collections';
  categoryId: number | null = null;
  isLoading: boolean = true;

  limit: number = 12;
  offset: number = 0;
  currentPage: number = 1;
  totalCount: number = 0;

  hasMoreData: boolean = true;
  isFetchingMore: boolean = false;

  breadcrumbs: any[] = [];
  categories: any[] = [];
  brands: any[] = [];
  genders: any[] = [];
  colors: any[] = [];
  sizes: any[] = [];
  ratings: any[] = [];
  discounts: any[] = [];
  products: any[] = [];

  minPrice = 0;
  maxPrice = 20000;
  selectedDiscount: any;
  currentSortValue: string = 'recommended';

  private fallbackCategories = [
    { id: 100, slug: 'clothing', name: 'Clothing' },
    { id: 122, slug: 'footwear', name: 'Footwear' },
    { id: 130, slug: 'personal-care', name: 'Personal Care' },
    { id: 132, slug: 'accessories', name: 'Accessories' },
    { id: 229, slug: 'toys-and-games', name: 'Toys & Games' }
  ];

  private http = inject(Http);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loadingService = inject(Loading);
  private ngZone = inject(NgZone); // 🔥 Injected NgZone for instant renders

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.slug = params.slug;
      this.isLoading = true;

      const queryParams = this.route.snapshot.queryParams;
      if (queryParams['sort']) this.currentSortValue = queryParams['sort'];

      this.currentPage = 1;
      this.offset = 0;
      this.hasMoreData = true;

      this.getCategoryId();
    });
  }

  getCategoryId() {
    this.http.getMenu().subscribe({
      next: (res: any) => {
        const menuItems = res.data || res;
        let matchedCategory = null;

        if (Array.isArray(menuItems)) {
          matchedCategory = this.findCategoryBySlug(menuItems, this.slug);
        }

        if (!matchedCategory) {
          matchedCategory = this.fallbackCategories.find(c => c.slug === this.slug);
        }

        if (matchedCategory) {
          this.categoryId = matchedCategory.id;
          this.categoryTitle = matchedCategory.name || 'Collections';
          this.getProductList(this.categoryId, false);
        } else {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  findCategoryBySlug(items: any[], targetSlug: string): any {
    for (const item of items) {
      if (item.path === targetSlug || item.slug === targetSlug) return item;
      if (item.subCategory && Array.isArray(item.subCategory) && item.subCategory.length > 0) {
        const found = this.findCategoryBySlug(item.subCategory, targetSlug);
        if (found) return found;
      }
    }
    return null;
  }

  ngAfterViewInit(): void { }

  fetchFilteredProducts() {
    this.currentPage = 1;
    this.offset = 0;
    this.hasMoreData = true;
    this.products = [];
    this.getProductList(this.categoryId, false);
  }

  onSortChanged(sortValue: any) {
    this.currentSortValue = sortValue;
    this.fetchFilteredProducts();
  }

  onScroll() {
    if (this.isLoading || this.isFetchingMore || !this.hasMoreData) return;

    this.currentPage++;
    this.offset = (this.currentPage - 1) * this.limit;
    this.getProductList(this.categoryId, true);
  }

  buildFilterPayload() {
    const payload: any = {};
    const queryParams = this.route.snapshot.queryParams;

    if (this.categories.length > 0) {
      const selectedCategories = this.categories.filter((c: any) => c.selected).map((c: any) => c.id);
      if (selectedCategories.length) payload.categoryIds = selectedCategories;
    } else if (queryParams['categories']) {
      payload.categoryIds = queryParams['categories'].split(',').map(Number);
    }

    if (this.brands.length > 0) {
      const selectedBrands = this.brands.filter((b: any) => b.selected).map((b: any) => b.name);
      if (selectedBrands.length) payload.brands = selectedBrands;
    } else if (queryParams['brands']) {
      payload.brands = queryParams['brands'].split(',');
    }

    if (this.colors.length > 0) {
      const selectedColors = this.colors.filter((c: any) => c.selected).map((c: any) => c.name);
      if (selectedColors.length) payload.colors = selectedColors;
    } else if (queryParams['colors']) {
      payload.colors = queryParams['colors'].split(',');
    }

    if (this.sizes.length > 0) {
      const selectedSizes = this.sizes.filter((s: any) => s.selected).map((s: any) => s.name);
      if (selectedSizes.length) payload.sizes = selectedSizes;
    } else if (queryParams['sizes']) {
      payload.sizes = queryParams['sizes'].split(',');
    }

    if (this.genders.length > 0) {
      const selectedGenders = this.genders.filter((g: any) => g.selected).map((g: any) => g.name);
      if (selectedGenders.length) payload.gender = selectedGenders[0];
    } else if (queryParams['gender']) {
      payload.gender = queryParams['gender'];
    }

    payload.minPrice = this.minPrice;
    payload.maxPrice = this.maxPrice;
    payload.sort = this.currentSortValue;

    if (this.selectedDiscount) {
      payload.minDiscount = parseInt(this.selectedDiscount, 10);
    } else if (queryParams['discount']) {
      payload.minDiscount = Number(queryParams['discount']);
    }

    return payload;
  }

  updateUrlWithFilters(payload: any) {
    const queryParams: any = {};

    if (payload.categoryIds?.length) queryParams.categories = payload.categoryIds.join(',');
    if (payload.brands?.length) queryParams.brands = payload.brands.join(',');
    if (payload.colors?.length) queryParams.colors = payload.colors.join(',');
    if (payload.sizes?.length) queryParams.sizes = payload.sizes.join(',');
    if (payload.gender) queryParams.gender = payload.gender;
    if (payload.minPrice > 0) queryParams.minPrice = payload.minPrice;
    if (payload.maxPrice < 20000) queryParams.maxPrice = payload.maxPrice;
    if (payload.minDiscount) queryParams.discount = payload.minDiscount;
    if (payload.sort && payload.sort !== 'recommended') queryParams.sort = payload.sort;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  getProductList(catId: any, isLoadMore: boolean = false) {
    if (isLoadMore) {
      this.isFetchingMore = true;
    } else {
      this.isLoading = true;
      this.loadingService.show();
    }

    const payload = this.buildFilterPayload();
    this.updateUrlWithFilters(payload);

    this.http.getProductList(catId, payload, this.limit, this.offset).subscribe({
      next: (res: any) => {
        // 🔥 FIX: Run strictly inside Angular Zone so UI redraws instantly! No timeouts!
        this.ngZone.run(() => {
          this.totalCount = res.metadata?.totalItems || 0;
          this.breadcrumbs = res.metadata?.breadcrumb || [];

          if (this.breadcrumbs.length > 0) {
            this.categoryTitle = this.breadcrumbs[this.breadcrumbs.length - 1].name;
          }

          const newProducts = (res.data || []).map((p: any) => ({
            ...p,
            original: p.price,
            price: p.offerPrice,
            discount: p.discount > 0 ? `(${p.discount}% OFF)` : '',
            size: p.availableSizes ? p.availableSizes.join(', ') : ''
          }));

          if (isLoadMore) {
            this.products = [...this.products, ...newProducts];
          } else {
            this.products = newProducts;
          }

          this.hasMoreData = (res.data || []).length === this.limit;

          if (res.filters) {
            const mergeState = (localArray: any[], apiArray: any[], matchKey: string) => {
              if (!apiArray) return [];
              return apiArray.map((apiItem: any) => {
                const localItem = localArray.find((l: any) => l[matchKey] === apiItem[matchKey]);
                return { ...apiItem, selected: localItem ? localItem.selected : !!apiItem.checked };
              });
            };

            this.categories = mergeState(this.categories, res.filters.categories, 'id');
            this.brands = mergeState(this.brands, res.filters.brands, 'id');
            this.colors = mergeState(this.colors, res.filters.colors, 'name');
            this.sizes = mergeState(this.sizes, res.filters.sizes, 'name');

            this.minPrice = res.filters.minPrice || 0;
            this.maxPrice = res.filters.maxPrice || 20000;

            if (res.filters.discountRanges) {
              this.discounts = res.filters.discountRanges.map((d: any) => {
                const parsedValue = parseInt(d.name, 10) || 0;
                return {
                  label: d.name,
                  value: parsedValue,
                  selected: this.selectedDiscount === parsedValue ? true : d.checked
                };
              });

              const activeDiscount = this.discounts.find(d => d.selected);
              if (activeDiscount && !this.selectedDiscount) {
                this.selectedDiscount = activeDiscount.value;
              }
            }
          }

          this.isLoading = false;
          this.isFetchingMore = false;
          this.loadingService.hide();
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.isFetchingMore = false;
          this.loadingService.hide();
          this.cdr.detectChanges();
        });
      }
    });
  }
}