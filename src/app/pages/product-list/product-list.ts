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

  private lastQueryParamsString: string = '';

  breadcrumbs: any[] = [];
  categories: any[] = [];
  brands: any[] = [];
  genders: any[] = [];
  colors: any[] = [];
  sizes: any[] = [];
  ratings: any[] = [];
  discounts: any[] = [];
  products: any[] = [];
  activeFilters: any[] = [];

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
  private ngZone = inject(NgZone);

  private encodeName(name: string): string { return name ? name.replace(/ /g, '-') : ''; }
  private decodeName(name: string): string { return name ? name.replace(/-/g, ' ') : ''; }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.slug = params.slug;
      this.isLoading = true;
      this.currentPage = 1;
      this.offset = 0;
      this.hasMoreData = true;

      // 🔥 FIX: Instantly clear out data and filters for immediate UI feedback when clicking Breadcrumbs
      this.products = [];
      this.activeFilters = [];
      this.clearLocalFilters();

      this.lastQueryParamsString = JSON.stringify(this.route.snapshot.queryParams);
      this.getCategoryId();
    });

    this.route.queryParams.subscribe(params => {
      const currentParamsString = JSON.stringify(params);

      if (this.categoryId && this.lastQueryParamsString !== currentParamsString) {
        this.lastQueryParamsString = currentParamsString;
        this.syncFiltersFromUrl(params);
        this.fetchFilteredProducts();
      }
    });
  }

  syncFiltersFromUrl(params: any) {
    this.categories.forEach(c => c.selected = false);
    this.brands.forEach(b => b.selected = false);
    this.colors.forEach(c => c.selected = false);
    this.sizes.forEach(s => s.selected = false);
    this.genders.forEach(g => g.selected = false);
    this.selectedDiscount = null;

    if (params.categories) {
      const names = params.categories.split(',').map((n: string) => this.decodeName(n));
      this.categories.forEach(c => c.selected = names.includes(c.name));
    }
    if (params.brands) {
      const names = params.brands.split(',').map((n: string) => this.decodeName(n));
      this.brands.forEach(b => b.selected = names.includes(b.name));
    }
    if (params.colors) {
      const names = params.colors.split(',').map((n: string) => this.decodeName(n));
      this.colors.forEach(c => c.selected = names.includes(c.name));
    }
    if (params.sizes) {
      const names = params.sizes.split(',').map((n: string) => this.decodeName(n));
      this.sizes.forEach(s => s.selected = names.includes(s.name));
    }
    if (params.gender) {
      const genderNames = params.gender.split(',').map((n: string) => this.decodeName(n));
      this.genders.forEach(g => g.selected = genderNames.includes(g.name));
    }

    if (params.discount) this.selectedDiscount = Number(params.discount);

    // Fallback to default constraints if URL has no bounds explicitly set
    this.minPrice = params.minPrice ? Number(params.minPrice) : 0;
    this.maxPrice = params.maxPrice ? Number(params.maxPrice) : 20000;

    if (params.sort) this.currentSortValue = params.sort;
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

          this.syncFiltersFromUrl(this.route.snapshot.queryParams);
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

    const selectedCategories = this.categories.filter((c: any) => c.selected).map((c: any) => c.id);
    if (selectedCategories.length) {
      payload.categoryIds = selectedCategories;
    } else if (queryParams['categories']) {
      payload.categoryNames = queryParams['categories'].split(',').map((n: string) => this.decodeName(n));
    }

    const selectedBrands = this.brands.filter((b: any) => b.selected).map((b: any) => b.name);
    if (selectedBrands.length) {
      payload.brands = selectedBrands;
    } else if (queryParams['brands']) {
      payload.brands = queryParams['brands'].split(',').map((n: string) => this.decodeName(n));
    }

    const selectedColors = this.colors.filter((c: any) => c.selected).map((c: any) => c.name);
    if (selectedColors.length) {
      payload.colors = selectedColors;
    } else if (queryParams['colors']) {
      payload.colors = queryParams['colors'].split(',').map((n: string) => this.decodeName(n));
    }

    const selectedSizes = this.sizes.filter((s: any) => s.selected).map((s: any) => s.name);
    if (selectedSizes.length) {
      payload.sizes = selectedSizes;
    } else if (queryParams['sizes']) {
      payload.sizes = queryParams['sizes'].split(',').map((n: string) => this.decodeName(n));
    }

    const selectedGenders = this.genders.filter((g: any) => g.selected).map((g: any) => g.name);
    if (selectedGenders.length) {
      payload.gender = selectedGenders[0];
    } else if (queryParams['gender']) {
      payload.gender = this.decodeName(queryParams['gender'].split(',')[0]);
    }

    // 🔥 FIX: Only attach min/max price dynamically if the user has changed them from defaults
    if (this.minPrice > 0) payload.minPrice = this.minPrice;
    if (this.maxPrice < 20000) payload.maxPrice = this.maxPrice;

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

    const catNames = this.categories.filter(c => c.selected).map(c => this.encodeName(c.name));
    if (catNames.length) queryParams.categories = catNames.join(',');

    const brandNames = this.brands.filter(b => b.selected).map(b => this.encodeName(b.name));
    if (brandNames.length) queryParams.brands = brandNames.join(',');

    const colorNames = this.colors.filter(c => c.selected).map(c => this.encodeName(c.name));
    if (colorNames.length) queryParams.colors = colorNames.join(',');

    const sizeNames = this.sizes.filter(s => s.selected).map(s => this.encodeName(s.name));
    if (sizeNames.length) queryParams.sizes = sizeNames.join(',');

    const genderNames = this.genders.filter(g => g.selected).map(g => this.encodeName(g.name));
    if (genderNames.length) queryParams.gender = genderNames.join(',');

    // Only apply limits in URL if they exist in the filtered payload
    if (payload.minPrice !== undefined) queryParams.minPrice = payload.minPrice;
    if (payload.maxPrice !== undefined) queryParams.maxPrice = payload.maxPrice;

    if (payload.minDiscount) queryParams.discount = payload.minDiscount;
    if (payload.sort && payload.sort !== 'recommended') queryParams.sort = payload.sort;

    this.lastQueryParamsString = JSON.stringify(queryParams);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  generateChips() {
    this.activeFilters = [];
    this.categories.filter(c => c.selected).forEach(c => this.activeFilters.push({ type: 'category', label: c.name, ref: c }));
    this.brands.filter(b => b.selected).forEach(b => this.activeFilters.push({ type: 'brand', label: b.name, ref: b }));
    this.colors.filter(c => c.selected).forEach(c => this.activeFilters.push({ type: 'color', label: c.name, ref: c }));
    this.sizes.filter(s => s.selected).forEach(s => this.activeFilters.push({ type: 'size', label: s.name, ref: s }));
    this.genders.filter(g => g.selected).forEach(g => this.activeFilters.push({ type: 'gender', label: g.name, ref: g }));

    if (this.selectedDiscount) {
      const d = this.discounts.find(x => x.value === this.selectedDiscount);
      if (d) this.activeFilters.push({ type: 'discount', label: d.label, ref: d });
    }

    if (this.currentSortValue && this.currentSortValue !== 'recommended') {
      const sortTitle = this.currentSortValue.replace(/_/g, ' ').toUpperCase();
      this.activeFilters.push({ type: 'sort', label: `Sort: ${sortTitle}`, ref: null });
    }
  }

  onRemoveFilter(chip: any) {
    if (['category', 'brand', 'color', 'size', 'gender'].includes(chip.type)) {
      chip.ref.selected = false;
    } else if (chip.type === 'discount') {
      this.selectedDiscount = null;
      this.discounts.forEach(d => d.selected = false);
    } else if (chip.type === 'sort') {
      this.currentSortValue = 'recommended';
    }
    this.fetchFilteredProducts();
  }

  clearLocalFilters() {
    this.categories.forEach(c => c.selected = false);
    this.brands.forEach(b => b.selected = false);
    this.colors.forEach(c => c.selected = false);
    this.sizes.forEach(s => s.selected = false);
    this.genders.forEach(g => g.selected = false);
    this.selectedDiscount = null;

    // Resets boundary defaults immediately
    this.minPrice = 0;
    this.maxPrice = 20000;
    this.currentSortValue = 'recommended';
  }

  clearAllFilters() {
    this.clearLocalFilters();
    this.fetchFilteredProducts();
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
        this.ngZone.run(() => {
          this.totalCount = res.metadata?.totalItems || 0;

          if (res.metadata?.breadcrumb) {
            if (typeof res.metadata.breadcrumb === 'string') {
              const segments = res.metadata.breadcrumb.split(' / ');
              this.breadcrumbs = segments.map((seg: string, i: number) => ({ name: seg, slug: i === 0 ? '/' : this.encodeName(seg) }));
              this.categoryTitle = segments[segments.length - 1];
            } else {
              this.breadcrumbs = res.metadata.breadcrumb;
              this.categoryTitle = this.breadcrumbs[this.breadcrumbs.length - 1]?.name || this.categoryTitle;
            }
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
            this.brands = mergeState(this.brands, res.filters.brands, 'name');
            this.colors = mergeState(this.colors, res.filters.colors, 'name');
            this.sizes = mergeState(this.sizes, res.filters.sizes, 'name');
            this.genders = mergeState(this.genders, res.filters.gender, 'name');

            // 🔥 FIX: Removed minPrice / maxPrice API mapping here so we NEVER overwrite the user's active slider position.

            if (res.filters.discountRanges) {
              this.discounts = res.filters.discountRanges.map((d: any) => {
                const parsedValue = parseInt(d.name, 10) || 0;
                return {
                  label: d.name,
                  value: parsedValue,
                  selected: this.selectedDiscount === parsedValue ? true : !!d.checked
                };
              });

              if (!this.selectedDiscount) {
                const activeDiscount = this.discounts.find(d => d.selected);
                this.selectedDiscount = activeDiscount ? activeDiscount.value : null;
              }
            }
          }

          this.generateChips();

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