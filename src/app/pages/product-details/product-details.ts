import { AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ProfileMenu } from '../../layout/profile-menu/profile-menu';
import { Toast } from '../../core/services/toast/toast';
import { Loading } from '../../core/services/loading/loading';
import { CommonProductGrid } from '../../layout/common-product-grid/common-product-grid';
import { CommonProductSwiper } from '../../layout/common-product-swiper/common-product-swiper';
import { Http } from '../../core/services/api/http';
import { Storage } from '../../core/services/storage/storage';
import { Subscription } from 'rxjs';
import { Alert } from '../../core/services/alert/alert';
import { ImageViewer } from '../../layout/image-viewer/image-viewer';

export interface IBreadcrumb { id: number | null; name: string; slug: string; }
export interface IRatingDivision { rating: number; count: number; percentage: number; }
export interface IRating { averageRating: number; totalCount: number; ratingDivision: IRatingDivision[]; }
export interface IPrice { price: number; offerPrice: number; discount: number; }
export interface IColor { name: string; checked: boolean; image: string; url: string; }
export interface ISizeOption {
  id: number | null;
  size: string;
  price: number | null;
  offerPrice?: number | null;
  discount?: number | null;
  available: boolean;
  product_left: string | null;
}
export interface ISize { sizeChart: string; sizeList: ISizeOption[]; }
export interface ISpecification { label: string; value: string; }
export interface IDetailedInfo { description: string; specification: ISpecification[]; }
export interface ICustomerReview { customerName: string; date: string; review: string; rating: number; }

export interface IProductDetails {
  breadcrumb: IBreadcrumb[];
  name: string;
  summary: string;
  images: string[];
  rating: IRating;
  price: IPrice;
  color: IColor[];
  size: ISize;
  sellerName: string;
  productDetails: IDetailedInfo;
  customerReview: ICustomerReview[];
  isWishlist?: boolean;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink, ProfileMenu, ReactiveFormsModule,
    CommonProductGrid, CommonProductSwiper, ImageViewer
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit, AfterViewInit {
  @ViewChild('mainSwiper') mainSwiper!: ElementRef;
  @ViewChild('thumbSwiper') thumbSwiper!: ElementRef;

  activeIndex = signal<number>(0);
  productDetails: IProductDetails | null = null;
  productId: any;
  selectedSize = signal<string>('');
  activeAccordion = signal<string>('description');

  isAuthChecked: boolean = false;
  isLoggedIn: boolean = false;
  isAddedToCart = signal<boolean>(false);

  isWishlisted = signal<boolean>(false);

  isViewerOpen = signal<boolean>(false);
  viewerImages = signal<string | string[]>([]);
  viewerInitialIndex = signal<number>(0);
  viewerTitle = signal<string>('');

  products: any = [];

  private authStateSub!: Subscription;
  private http = inject(Http);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loadingService = inject(Loading);
  private toastService = inject(Toast);
  private platformId = inject(PLATFORM_ID);
  private storage = inject(Storage);
  private alertService = inject(Alert);

  mainSwiperConfig = signal({
    slidesPerView: 1,
    loop: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
    navigation: { nextEl: '.gallery-next', prevEl: '.gallery-prev' }
  });

  thumbSwiperConfig = signal({
    direction: 'vertical',
    spaceBetween: 12,
    watchSlidesProgress: true,
    breakpoints: {
      0: { direction: 'horizontal', slidesPerView: 4 },
      768: { direction: 'vertical', slidesPerView: 4 }
    }
  });

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.productId = params.productId;
      this.isAddedToCart.set(false);
      this.isWishlisted.set(false);

      if (this.isAuthChecked) {
        this.getProductDetails(this.productId);
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthAndLoadData();

      this.authStateSub = this.http.authStateChange$.subscribe((loggedInStatus) => {
        setTimeout(() => {
          this.isLoggedIn = loggedInStatus;
          if (this.productId) {
            this.getProductDetails(this.productId);
          }
          this.cdr.detectChanges();
        }, 0);
      });
    } else {
      this.isAuthChecked = true;
      if (this.productId) {
        this.getProductDetails(this.productId);
      }
    }
  }

  ngOnDestroy() {
    if (this.authStateSub) this.authStateSub.unsubscribe();
  }

  checkAuthAndLoadData() {
    this.storage.get('accessToken').then(token => {
      setTimeout(() => {
        this.isAuthChecked = true;
        this.isLoggedIn = !!token;
        if (this.productId) {
          this.getProductDetails(this.productId);
        }
        this.cdr.detectChanges();
      }, 0);
    });
  }

  getProductDetails(productId: any, silent: boolean = false) {
    const showLoader = !silent && !this.productDetails;
    if (showLoader) {
      this.loadingService.show();
    }

    this.http.getProductDetails(productId, this.isLoggedIn).subscribe({
      next: (res: any) => {
        const data = res.data || res;
        if (data && Object.keys(data).length > 0) {
          const isFirstRender = !this.productDetails;
          this.productDetails = data;
          this.isWishlisted.set(!!data.isWishlist);

          if (isFirstRender) {
            this.initializeSwipers();
          }
        } else if (!silent) {
          this.toastService.show(res.message || 'Product details not found', 'error');
        }
        if (showLoader) {
          this.loadingService.hide();
        }
        this.cdr.detectChanges();
      },
      error: () => {
        if (!silent) {
          this.toastService.show('Something went wrong. Please try again.', 'error');
        }
        if (showLoader) {
          this.loadingService.hide();
        }
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit() {
    this.initializeSwipers();
  }

  initializeSwipers() {
    if (isPlatformBrowser(this.platformId) && this.productDetails?.images?.length) {
      setTimeout(() => {
        if (this.mainSwiper?.nativeElement) {
          Object.assign(this.mainSwiper.nativeElement, this.mainSwiperConfig());
          this.mainSwiper.nativeElement.initialize();
        }
        if (this.thumbSwiper?.nativeElement) {
          Object.assign(this.thumbSwiper.nativeElement, this.thumbSwiperConfig());
          this.thumbSwiper.nativeElement.initialize();
        }
        const mainSwiperEl = this.mainSwiper?.nativeElement?.swiper;
        if (mainSwiperEl) {
          mainSwiperEl.on('realIndexChange', () => {
            this.activeIndex.set(mainSwiperEl.realIndex);
            if (this.thumbSwiper?.nativeElement?.swiper) {
              this.thumbSwiper.nativeElement.swiper.slideTo(this.activeIndex());
            }
            this.cdr.detectChanges();
          });
        }
      }, 300);
    }
  }

  goToSlide(index: number) {
    this.activeIndex.set(index);
    if (this.mainSwiper?.nativeElement?.swiper) {
      this.mainSwiper.nativeElement.swiper.slideToLoop(index);
    }
  }

  getStarsArray(rating: number): number[] {
    return Array(Math.round(rating || 0)).fill(0).map((_, i) => i + 1);
  }

  get activePrice(): IPrice | null {
    if (!this.productDetails) return null;

    const selected = this.productDetails.size?.sizeList?.find(
      s => s.size === this.selectedSize()
    );

    if (selected && (selected.offerPrice != null || selected.price != null)) {
      return {
        price: selected.price ?? this.productDetails.price?.price ?? 0,
        offerPrice: selected.offerPrice ?? selected.price ?? this.productDetails.price?.offerPrice ?? 0,
        discount: selected.discount ?? 0
      };
    }

    return this.productDetails.price || null;
  }

  selectSize(size: string, available: boolean) {
    if (available) {
      this.selectedSize.set(size);
      this.isAddedToCart.set(false);
    }
  }

  toggleAccordion(section: string) {
    this.activeAccordion.update(val => val === section ? '' : section);
  }


  async addToBag() {
    if (!this.isLoggedIn) {
      const isConfirmed = await this.alertService.show({
        title: 'Login Required',
        message: 'You have to login to add items to your cart.',
        confirmText: 'Login',
        cancelText: 'Cancel'
      });

      if (isConfirmed) {
        this.router.navigate(['/login']);
      }
      return;
    }

    if (!this.selectedSize()) {
      this.toastService.show('You have to select a size to add to cart.', 'warning');
      const sizeSection = document.getElementById('size-selection-section');
      if (sizeSection) {
        sizeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const sizeData = this.productDetails?.size?.sizeList?.find(s => s.size === this.selectedSize());
    const variantId = sizeData?.id || 0;

    const payload = {
      productId: Number(this.productId),
      variantId: variantId,
      quantity: 1
    };

    this.loadingService.show();
    this.http.addToCart(payload).subscribe({
      next: (res: any) => {
        this.loadingService.hide();
        if (res.status) {
          this.toastService.show(res.message, 'success');
          this.isAddedToCart.set(true);
        } else {
          this.toastService.show(res.message, 'error');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingService.hide();
        this.toastService.show('Something went wrong. Please try again!', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  async toggleWishlist() {
    if (!this.isLoggedIn) {
      const isConfirmed = await this.alertService.show({
        title: 'Login Required',
        message: 'You have to login to add items to your wishlist.',
        confirmText: 'Login',
        cancelText: 'Cancel'
      });

      if (isConfirmed) {
        this.router.navigate(['/login']);
      }
      return;
    }

    if (!this.isWishlisted()) {
      // Add to Wishlist
      this.loadingService.show();
      this.http.addToWishlist({ productId: [Number(this.productId)] }).subscribe({
        next: (res: any) => {
          this.loadingService.hide();
          if (res.status) {
            this.isWishlisted.set(true);
            // this.toastService.show(res.message || 'Added to wishlist', 'success');
          } else {
            this.toastService.show(res.message || 'Failed to add to wishlist', 'error');
          }
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadingService.hide();
          this.toastService.show('Something went wrong. Please try again!', 'error');
          this.cdr.detectChanges();
        }
      });
    } else {
      // Remove from Wishlist
      this.toastService.show('Go to wishlist', 'warning');
      // const idToRemove = Number(this.productId);
      // this.loadingService.show();
      // this.http.removeWishlistItems(idToRemove).subscribe({
      //   next: (res: any) => {
      //     this.loadingService.hide();
      //     if (res.status) {
      //       this.isWishlisted.set(false);
      //       this.toastService.show(res.message || 'Removed from wishlist', 'success');
      //     } else {
      //       this.toastService.show(res.message || 'Failed to remove from wishlist', 'error');
      //     }
      //     this.cdr.detectChanges();
      //   },
      //   error: () => {
      //     this.loadingService.hide();
      //     this.toastService.show('Something went wrong. Please try again!', 'error');
      //     this.cdr.detectChanges();
      //   }
      // });
    }
  }

  openImageViewer(images: string | string[], index: number = 0, title: string = '') {
    this.viewerImages.set(images);
    this.viewerInitialIndex.set(index);
    this.viewerTitle.set(title);
    this.isViewerOpen.set(true);
  }

  closeImageViewer() {
    this.isViewerOpen.set(false);
  }

}