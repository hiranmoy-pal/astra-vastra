import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { Toast } from '../../core/services/toast/toast';
import { Loading } from '../../core/services/loading/loading';
import { RouterLink, RouterModule } from '@angular/router';
import { Http } from '../../core/services/api/http';
import { CommonProductSwiper } from '../../layout/common-product-swiper/common-product-swiper';
import { CommonProductGrid } from '../../layout/common-product-grid/common-product-grid';
import { CommonCategory } from '../../layout/common-category/common-category';
import { Subscription } from 'rxjs';
import { Storage } from '../../core/services/storage/storage';
import { Alert } from '../../core/services/alert/alert';

@Component({
  selector: 'app-home',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink, CommonProductSwiper, CommonProductGrid, CommonCategory
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {

  @ViewChild('swiperRefBanner') swiperRefBanner!: ElementRef;
  hoverTimers = new WeakMap<any, any>();
  currentYear: number = new Date().getFullYear();
  private readonly heroWord = 'Fluidity.';
  typedWord = signal<string>(this.heroWord);
  private typingTimer: any;
  private isBannerInitialized = false;

  isAuthChecked: boolean = false;
  isLoggedIn: boolean = false;

  // Independent loading states for Home 1 (fast) & Home 2 (slower)
  isHome1Loading: boolean = true;
  isHome2Loading: boolean = true;

  // Skeleton placeholder counts
  readonly brandSkeletons = Array(6).fill(0);
  readonly categorySkeletons = Array(6).fill(0);
  readonly productSwiperSkeletons = Array(4).fill(0);
  readonly productGridSkeletons = Array(8).fill(0);

  // Home 1 Data
  latestProductImage: string = '';
  private readonly fallbackHeroImage = 'https://rukminim2.flixcart.com/image/612/612/xif0q/sari/s/y/w/free-tiranga9601-smc-sareemall-unstitched-original-imah8eqbkzewzq6z.jpeg?q=70';
  banners: any[] = [];
  brands: any[] = [];
  categories: any[] = [];

  // Home 2 Data
  trendingProducts: any[] = [];
  discountedProducts: any[] = [];

  private authStateSub!: Subscription;
  private http = inject(Http);
  private toast = inject(Toast);
  private loading = inject(Loading);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private storage = inject(Storage);
  private zone = inject(NgZone);
  private alert = inject(Alert);

  bannerSwiperConfig = signal({
    cssMode: true,
    spaceBetween: 16,
    loop: true,
    speed: 650,
    grabCursor: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    pagination: {
      el: '.banner-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.banner-next',
      prevEl: '.banner-prev'
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 12
      },
      576: {
        slidesPerView: 1,
        spaceBetween: 14
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 16
      },
      1024: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      1280: {
        slidesPerView: 1,
        spaceBetween: 22
      }
    }
  });
  
  constructor() { }

  ngOnInit() {
    // 1. Always fetch Home 1 (Runs on both Server & Browser via Angular TransferCache)
    this.getHome1Data();

    if (isPlatformBrowser(this.platformId)) {
      this.startTypewriter();
      this.checkAuthAndLoadData();

      this.authStateSub = this.http.authStateChange$.subscribe((loggedInStatus) => {
        this.zone.run(() => {
          this.isLoggedIn = loggedInStatus;
          this.getHome2Data(this.isLoggedIn);
          this.cdr.detectChanges();
        });
      });
    } else {
      // 2. SSR: Fetch public Home 2 immediately for instant SEO & first paint
      this.getHome2Data(false);
    }
  }

  checkAuthAndLoadData() {
    this.storage.get('accessToken').then(token => {
      this.zone.run(() => {
        this.isAuthChecked = true;
        this.isLoggedIn = !!token;
        this.getHome2Data(this.isLoggedIn);
        this.cdr.detectChanges();
      });
    });
  }

  getHome1Data() {
    if (this.banners.length === 0) {
      this.isHome1Loading = true;
    }

    this.http.getHome1().subscribe({
      next: (res: any) => {
        if (res.status && res.data) {
          this.latestProductImage = res.data.latestProductImage || this.fallbackHeroImage;
          this.banners = res.data.banners || [];
          this.brands = res.data.topBrands || [];
          this.categories = res.data.topCategories || [];
        } else {
          this.latestProductImage = this.fallbackHeroImage;
        }

        this.isHome1Loading = false;
        this.cdr.detectChanges();

        if (isPlatformBrowser(this.platformId) && this.banners.length > 0) {
          this.initBannerSwiper();
        }
      },
      error: (err) => {
        console.error('Failed to load Home 1 data:', err);
        this.latestProductImage = this.fallbackHeroImage;
        this.isHome1Loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getHome2Data(isLoggedIn: boolean) {
    // Only show skeleton if products are not already rendered (prevents SSR hydration flicker)
    if (this.trendingProducts.length === 0 && this.discountedProducts.length === 0) {
      this.isHome2Loading = true;
    }

    this.http.getHome2(isLoggedIn).subscribe({
      next: (res: any) => {
        if (res.status && res.data) {
          const mapProduct = (p: any) => ({
            ...p,
            original: p.price,
            price: p.offerPrice,
            discount: p.discount > 0 ? `(${p.discount}% OFF)` : '',
            size: p.availableSizes ? p.availableSizes.join(', ') : ''
          });

          this.trendingProducts = (res.data.trendingProducts || []).map(mapProduct);
          this.discountedProducts = (res.data.discountedProducts || []).map(mapProduct);
        }
        this.isHome2Loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load Home 2 data:', err);
        this.isHome2Loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private initBannerSwiper() {
    setTimeout(() => {
      if (this.swiperRefBanner?.nativeElement && !this.isBannerInitialized) {
        Object.assign(this.swiperRefBanner.nativeElement, this.bannerSwiperConfig());
        this.swiperRefBanner.nativeElement.initialize();
        this.isBannerInitialized = true;
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.authStateSub) this.authStateSub.unsubscribe();
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
  }

  private startTypewriter() {
    let charIndex = this.heroWord.length;
    let isDeleting = true;

    const tick = () => {
      if (isDeleting) {
        charIndex--;
        this.typedWord.set(this.heroWord.slice(0, charIndex));

        if (charIndex === 0) {
          isDeleting = false;
          this.typingTimer = setTimeout(tick, 450);
          return;
        }
        this.typingTimer = setTimeout(tick, 75);
      } else {
        charIndex++;
        this.typedWord.set(this.heroWord.slice(0, charIndex));

        if (charIndex === this.heroWord.length) {
          isDeleting = true;
          this.typingTimer = setTimeout(tick, 2200);
          return;
        }
        this.typingTimer = setTimeout(tick, 115);
      }
    };

    this.typingTimer = setTimeout(tick, 1800);
  }

  scrollToSection(sectionId: string) {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}