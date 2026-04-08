import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Header } from '../../layout/header/header';
import { CommonModule } from '@angular/common';
import { Footer } from '../../layout/footer/footer';
import { RouterLink, RouterModule } from '@angular/router';
import { Theme } from '../../core/services/theme/theme';
import { Toast } from '../../core/services/toast/toast';
import { Loading } from '../../core/services/loading/loading';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink
  ],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist implements OnInit, AfterViewInit {

  hoverTimers = new WeakMap<any, any>();

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
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/p/d/9/free-bebydoll-night-dress-unitrust-original-imah6t58na43hebf.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/g/1/l/free-bebydoll-night-dress-unitrust-original-imah6t58hqkamhjh.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/babydoll/n/o/l/free-s-9-red-fs-sgc-sweden-original-imahytcv8etjtcwh.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/u/b/5/free-bebydoll-night-dress-unitrust-original-imah6t58h9mguknu.jpeg?q=90'
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
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/i/n/p/free-bebydoll-night-dress-unitrust-original-imahh7jhrwskbbdr.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/u/l/r/free-bebydoll-night-dress-unitrust-original-imahh7jh6au9rhpp.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/r/q/c/free-bebydoll-night-dress-unitrust-original-imahh7jhdzbsfkqj.jpeg?q=90'
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
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/e/c/w/48-bf-farha-broadbelt-set-rani-body-figure-original-imahhzczdqzyf7zh.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/c/q/f/46b-bf-farha-broadbelt-set-rani-body-figure-original-imahhzczwcqxw9zs.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/o/b/e/48-bf-farha-broadbelt-set-rani-body-figure-original-imahhzczvpsycrt5.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/y/g/x/48-bf-farha-broadbelt-set-rani-body-figure-original-imahhzczvbzzbvvf.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/8/v/i/48-bf-farha-broadbelt-set-rani-body-figure-original-imahhzczznytwew7.jpeg?q=90'
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
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/e/r/4/30-18mm-non-padded-set-oumar-bibi-original-imahbhhx7yvbshup.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/j/z/e/34-18mm-nonpadded-oumar-bibi-original-imahbhh3gf2nzsma.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shopsy-lingerie-set/a/e/o/40-18mmnonpad-oumar-bibi-original-imahb3ty6gv3ezkv.jpeg?q=90'
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
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/j/x/m/34-v4nbrs-maroon-34-pack-1-vanila-original-imahkyjmzs9sbxs6.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/r/y/7/34-v4nbrs-maroon-34-pack-1-vanila-original-imahkyjmavkrbb5v.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/a/v/4/34-v4nbrs-maroon-34-pack-1-vanila-original-imahkyjmfyppzts7.jpeg?q=90'
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

  constructor(
    public themeService: Theme,
    public toastService: Toast,
    public loadingService: Loading,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit() {
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 2000);
  }

  ngAfterViewInit() {
  }

  startSwiper(event: any) {
    const container = event.currentTarget;
    const swiperEl = container.querySelector('swiper-container');

    if (!swiperEl) return;

    if (!swiperEl.classList.contains('swiper-initialized')) {
      Object.assign(swiperEl, {
        loop: true,
        speed: 500,
        autoplay: {
          delay: 600,
          disableOnInteraction: false
        },
        pagination: {
          clickable: true
        }
      });

      setTimeout(() => { swiperEl.initialize(); }, 400);
    }

    const swiper = swiperEl.swiper;
    if (!swiper) return;

    swiper.autoplay.stop();
    swiper.slideToLoop(0, 0);

    if (this.hoverTimers.has(container)) {
      clearTimeout(this.hoverTimers.get(container));
    }

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
