import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-common-product-grid',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterLink],
  templateUrl: './common-product-grid.html',
  styleUrl: './common-product-grid.scss',
})
export class CommonProductGrid {
  @Input() title: string = 'Explore More';
  @Input() products: any[] = [];

  hoverTimers = new WeakMap<any, any>();

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
