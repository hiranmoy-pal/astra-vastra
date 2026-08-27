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

  brands: any = [
    { "id": 1100, "name": "Puma", "image": 'https://m.media-amazon.com/images/G/31/IMG25/Fashion/BAU/Flip/MF/PC/Brands/Clothing/Puma_390x537._CB798874077_.png', "path": "puma" },
    { "id": 1100, "name": "Raymond", "image": 'https://m.media-amazon.com/images/G/31/IMG25/Fashion/BAU/Flip/MF/PC/Brands/Clothing/Raymond_390x537._CB798874077_.png', "path": "nike" },
    { "id": 1100, "name": "Addidas", "image": 'https://m.media-amazon.com/images/G/31/IMG25/Fashion/BAU/Flip/MF/PC/Brands/Clothing/New_Adidas._CB797111257_.png', "path": "addidas" },
    { "id": 1100, "name": "Us Polo", "image": 'https://m.media-amazon.com/images/G/31/IMG25/Fashion/BAU/Flip/MF/PC/Brands/Clothing/USPA_390x537._CB798874077_.png', "path": "us-polo" },
    { "id": 1100, "name": "Woodland", "image": 'https://m.media-amazon.com/images/G/31/IMG25/Fashion/BAU/Flip/MF/Brands/Footwear_Woodland_412x621._CB798826132_.png', "path": "lee-cooper" },
    { "id": 1100, "name": "Fastrack", "image": 'https://m.media-amazon.com/images/G/31/IMG25/Fashion/Winterflip/WF/Watch/Watches___Fastrack_412x621._CB797026381_.png', "path": "fastrack" },
    { "id": 1100, "name": "Highlander", "image": 'https://m.media-amazon.com/images/G/31/IMG25/Fashion/BAU/Flip/Serve/Highlander_382x599._CB798872528_.png', "path": "roadster" },
    { "id": 1100, "name": "Levis", "image": 'https://m.media-amazon.com/images/G/31/IMG25/Fashion/BAU/Flip/MF/PC/Brands/Clothing/Levis_390x537._CB798874077_.png', "path": "french-connection" },
  ];

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
            this.brandList = res.data?.brandList || [];
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

  ngAfterViewInit() { }
}