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

export interface IBreadcrumb { id: number | null; name: string; slug: string; }
export interface IRatingDivision { rating: number; count: number; percentage: number; }
export interface IRating { averageRating: number; totalCount: number; ratingDivision: IRatingDivision[]; }
export interface IPrice { price: number; offerPrice: number; discount: number; }
export interface IColor { name: string; checked: boolean; image: string; url: string; }
export interface ISizeOption { id: number | null; size: string; price: number | null; available: boolean; product_left: string; }
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
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink, ProfileMenu, ReactiveFormsModule,
    CommonProductGrid, CommonProductSwiper
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
  showSizeGuide = signal<boolean>(false);
  activeAccordion = signal<string>('description');

  products = [
    {
      productId: 1,
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit Round Neck Leg Suit Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      productId: 2,
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      productId: 3,
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      productId: 4,
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      productId: 5,
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      productId: 6,
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      productId: 7,
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      productId: 8,
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      productId: 9,
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      productId: 10,
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    }
  ];

  private http = inject(Http);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loadingService = inject(Loading);
  private toastService = inject(Toast);
  private platformId = inject(PLATFORM_ID);

  mainSwiperConfig = signal({
    slidesPerView: 1,
    loop: true,
    autoplay: { delay: 2500, disableOnInteraction: false },
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
      this.getProductDetails(this.productId);
    });
  }

  getProductDetails(productId: any) {
    this.loadingService.show();
    this.http.getProductDetails(productId).subscribe({
      next: (res: any) => {
        const data = res.data || res;
        if (data && Object.keys(data).length > 0) {
          this.productDetails = data;
          this.initializeSwipers();
        } else {
          this.toastService.show(res.message || 'Product details not found', 'error');
        }
        this.loadingService.hide();
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastService.show('Something went wrong. Please try again.', 'error');
        this.loadingService.hide();
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

  selectSize(size: string, available: boolean) {
    if (available) {
      this.selectedSize.set(size);
    }
  }

  toggleSizeGuide() {
    this.showSizeGuide.update(val => !val);
  }

  toggleAccordion(section: string) {
    this.activeAccordion.update(val => val === section ? '' : section);
  }
}