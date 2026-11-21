import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { Theme } from '../../core/services/theme/theme';
import { Toast } from '../../core/services/toast/toast';
import { Loading } from '../../core/services/loading/loading';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { Http } from '../../core/services/api/http';
import { CommonCategory } from '../../layout/common-category/common-category';

@Component({
  selector: 'app-category-list',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink, CommonCategory
  ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList implements OnInit, AfterViewInit {

  categoryList: any[] = [];
  subCategoryList: any[] = [];
  brandList: any[] = [];
  slug: string = '';
  categoryId: number | null = null;
  isLoading: boolean = true;

  private http = inject(Http);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  constructor(
    public themeService: Theme,
    public toastService: Toast,
    public loadingService: Loading,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      // Use setTimeout to prevent NG0100 ExpressionChanged error during rapid route changes
      setTimeout(() => {
        this.slug = params.slug;
        this.isLoading = true;
        this.getCategoryId();
        this.cdr.detectChanges();
      });
    });
  }

  getCategoryId() {
    this.http.getMenu().subscribe({
      next: (res: any) => {
        setTimeout(() => { // <-- Wrapped in setTimeout
          const menuItems = res.data || res;
          if (Array.isArray(menuItems)) {
            const matchedCategory = menuItems.find((item: any) => item.path === this.slug);
            if (matchedCategory) {
              this.categoryId = matchedCategory.id;
              this.getCategoryList(this.categoryId);
            } else {
              console.warn('No 1st layer menu category found for slug:', this.slug);
              this.isLoading = false;
              this.cdr.detectChanges();
            }
          }
        });
      },
      error: (err) => {
        setTimeout(() => {
          console.error('Failed to load menu data for slug matching', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  getCategoryList(catId: any) {
    this.http.getCategories(catId).subscribe({
      next: (res: any) => {
        setTimeout(() => {
          if (res.status && res.data) {
            this.categoryList = res.data?.categoryList || [];
            this.subCategoryList = res.data?.subCategoryList || [];
            this.brandList = res.data?.brands || [];
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        setTimeout(() => {
          console.error('Failed to load Category', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  get formattedGender(): string {
    if (!this.slug) return '';
    return this.slug.charAt(0).toUpperCase() + this.slug.slice(1).toLowerCase();
  }

  ngAfterViewInit() { }
}