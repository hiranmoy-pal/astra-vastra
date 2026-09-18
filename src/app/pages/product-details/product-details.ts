import { AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ProfileMenu } from '../../layout/profile-menu/profile-menu';
import { ReactiveFormsModule } from '@angular/forms';
import { Theme } from '../../core/services/theme/theme';
import { Toast } from '../../core/services/toast/toast';
import { Loading } from '../../core/services/loading/loading';
import { CommonProductGrid } from '../../layout/common-product-grid/common-product-grid';
import { CommonProductSwiper } from '../../layout/common-product-swiper/common-product-swiper';

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
  hoverTimers = new WeakMap<any, any>();
  @ViewChild('mainSwiper') mainSwiper!: ElementRef;
  @ViewChild('thumbSwiper') thumbSwiper!: ElementRef;
  activeIndex = 0;

  products = [
    {
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
  images = [
    'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1200',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1200',
    'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1200',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1200'
  ];


  mainSwiperConfig = signal({
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false
    },
    navigation: {
      nextEl: '.gallery-next',
      prevEl: '.gallery-prev'
    }
  });

  thumbSwiperConfig = signal({
    direction: 'vertical',
    spaceBetween: 12,
    watchSlidesProgress: true,
    breakpoints: {
      0: {
        direction: 'horizontal',
        slidesPerView: 4
      },

      768: {
        direction: 'vertical',
        slidesPerView: 4
      }
    }
  });


  constructor(
    public themeService: Theme,
    public toastService: Toast,
    public loadingService: Loading,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        Object.assign(this.mainSwiper.nativeElement, this.mainSwiperConfig());
        this.mainSwiper.nativeElement.initialize();

        Object.assign(this.thumbSwiper.nativeElement, this.thumbSwiperConfig());
        this.thumbSwiper.nativeElement.initialize();

        const mainSwiperEl = this.mainSwiper.nativeElement.swiper;
        mainSwiperEl.on('realIndexChange', () => {
          this.activeIndex = mainSwiperEl.realIndex;
          this.thumbSwiper.nativeElement.swiper.slideTo(this.activeIndex);
          this.cdr.detectChanges();
        });
      }, 400);
    }
  }

  goToSlide(index: number) {
    this.activeIndex = index;
    this.mainSwiper.nativeElement.swiper.slideToLoop(index);
  }

}
