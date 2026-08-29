import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, Input, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-common-product-swiper',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterLink],
  templateUrl: './common-product-swiper.html',
  styleUrl: './common-product-swiper.scss',
})
export class CommonProductSwiper implements AfterViewInit {
  @Input() title: string = 'Explore More';
  @Input() products: any[] = [];

  @ViewChild('swiperSimilarProduct') swiperSimilarProduct!: ElementRef;
  hoverTimers = new WeakMap<any, any>();

  trendingSwiperConfig = signal({
    cssMode: true,
    navigation: {
      nextEl: '.custom-swiper-next',
      prevEl: '.custom-swiper-prev',
    },
    pagination: false,
    breakpoints: {
      0: { slidesPerView: 1.2, spaceBetween: 12 },
      768: { slidesPerView: 3.2, spaceBetween: 16 },
      1024: { slidesPerView: 4.2, spaceBetween: 20 },
      1400: { slidesPerView: 4.4, spaceBetween: 20 }
    }
  });

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId) && this.swiperSimilarProduct) {
      setTimeout(() => {
        Object.assign(this.swiperSimilarProduct.nativeElement, this.trendingSwiperConfig());
        this.swiperSimilarProduct.nativeElement.initialize();
      }, 400);
    }
  }

  startSwiper(event: any) {
    const container = event.currentTarget;
    const swiperEl = container.querySelector('swiper-container');
    if (!swiperEl) return;

    if (!swiperEl.classList.contains('swiper-initialized')) {
      Object.assign(swiperEl, {
        loop: true, speed: 500,
        autoplay: { delay: 600, disableOnInteraction: false },
        pagination: { clickable: true }
      });
      setTimeout(() => { swiperEl.initialize(); }, 400);
    }

    const swiper = swiperEl.swiper;
    if (!swiper) return;

    swiper.autoplay.stop();
    swiper.slideToLoop(0, 0);

    if (this.hoverTimers.has(container)) clearTimeout(this.hoverTimers.get(container));
    const timer = setTimeout(() => {
      container.classList.add('swiper-active');
      swiper.autoplay.start();
    }, 600);
    this.hoverTimers.set(container, timer);
  }

  resetSwiper(event: any) {
    const container = event.currentTarget;
    const swiperEl = container.querySelector('swiper-container');
    const swiper = swiperEl?.swiper;

    if (this.hoverTimers.has(container)) {
      clearTimeout(this.hoverTimers.get(container));
      this.hoverTimers.delete(container);
    }
    container.classList.remove('swiper-active');

    if (swiper) {
      swiper.autoplay.stop();
      swiper.slideToLoop(0, 0);
    }
  }
}