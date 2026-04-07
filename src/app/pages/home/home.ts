import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { Theme } from '../../core/services/theme/theme';
import { Toast } from '../../core/services/toast/toast';
import { Loading } from '../../core/services/loading/loading';

@Component({
  selector: 'app-home',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [Header, Footer, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})

export class Home implements OnInit, AfterViewInit {

  @ViewChild('swiperRefBanner') swiperRefBanner!: ElementRef;
  @ViewChild('swiperRefBrand') swiperRefBrand!: ElementRef;

  banners = [
    'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/d17697e94e3af1ff.jpg?q=60',
    'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/5017a43fc014e1f6.png?q=60',
    'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/c966eebea8d80fcb.png?q=60',
    'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/4e25a99384af1be3.png?q=60',
    'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/428ea77977271cc4.png?q=60'
  ];

  brands = [
    'LUMINA', 'VELVET', 'AURA', 'PRISM', 'ORBIT',
    'Adidas', 'Nike', 'PUMA'
  ];

  categories: any = [
    { title: 'Ethnic Wear', offer: '50-80% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/sari/s/y/w/free-tiranga9601-smc-sareemall-unstitched-original-imah8eqbkzewzq6z.jpeg?q=60' },
    { title: 'Casual Wear', offer: '40-80% OFF', image: 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90' },
    { title: "Men's Activewear", offer: '30-70% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/lingerie-set/n/y/y/36-sh-kes-4g-li-dp36-arvaan-collective-original-imahjghjycpreeqp.jpeg?q=70' },
    { title: "Women's Activewear", offer: '30-70% OFF', image: 'https://rukminim1.flixcart.com/fk-p-flap/700/920/image/900d3a154290e527.png?q=60' },
    { title: 'Western Wear', offer: '40-80% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/top/d/t/9/l-1-crop-top-bw-xs-chroma-style-original-imahhvarxbrpdyyf.jpeg?q=60' },
    { title: 'Sportswear', offer: '30-80% OFF', image: 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90' },
    { title: 'Sleepwear', offer: '50-70% OFF', image: 'https://rukminim1.flixcart.com/fk-p-flap/700/1060/image/2edef08631cc5d3f.jpg?q=60' },
    { title: 'Western Wear', offer: '40-80% OFF', image: 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/a/v/4/34-v4nbrs-maroon-34-pack-1-vanila-original-imahkyjmfyppzts7.jpeg?q=90' },
    { title: 'Sportswear', offer: '30-80% OFF', image: 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90' },
    { title: 'Sleepwear', offer: '50-70% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/ethnic-set/i/g/b/3xl-jokp-5144olive-jompers-original-imahdnukqz5eyhhv.jpeg?q=70' },
    { title: 'Innerwear', offer: '40-60% OFF', image: 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/d/a/6/30-sfh100-lpl-limewide-original-imagzeqsfsv9khay.jpeg?q=90' },
    { title: 'Western Wear', offer: '40-80% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shirt/x/w/6/s-st112-vebnor-original-imahhfzgagf4zzaj.jpeg?q=70' },
    { title: 'Sportswear', offer: '30-80% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shirt/x/p/0/-original-imaghkfu8hm4gxbh.jpeg?q=70' },
    { title: 'Sleepwear', offer: '50-70% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shirt/0/e/e/l-vbn-m-487-elvaro-original-imahkbrkhj6pycg4.jpeg?q=70' },
    { title: 'Innerwear', offer: '40-60% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/lingerie-set/v/d/j/28-prnt-set-2100-fasharious-original-imahh4kqfppbvkcj.jpeg?q=70' },
    { title: 'Innerwear', offer: '40-60% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/ethnic-set/g/g/i/xxl-jokp-p-5006blue-jompers-original-imagrvh7wfpytphe.jpeg?q=70' }
  ];

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

  brandSwiperConfig = signal({
    spaceBetween: 40,
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      0: {
        slidesPerView: 2
      },
      576: {
        slidesPerView: 2
      },
      768: {
        slidesPerView: 2
      },
      1024: {
        slidesPerView: 4
      },
      1200: {
        slidesPerView: 6
      },
      1280: {
        slidesPerView: 6
      }
    }
  });

  bannerSwiperConfig = signal({
    spaceBetween: 10,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    pagination: {
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      576: {
        slidesPerView: 1.2
      },
      768: {
        slidesPerView: 1.2
      },
      1024: {
        slidesPerView: 2.2
      },
      1200: {
        slidesPerView: 2.2
      },
      1280: {
        slidesPerView: 2.2
      }
    }
  });

  constructor(
    public themeService: Theme,
    public toastService: Toast,
    public loadingService: Loading,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit() {
    this.toastService.show('Saved successfully', 'success');
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 2000);
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        Object.assign(this.swiperRefBanner.nativeElement, this.bannerSwiperConfig());
        this.swiperRefBanner.nativeElement.initialize();

        Object.assign(this.swiperRefBrand.nativeElement, this.brandSwiperConfig());
        this.swiperRefBrand.nativeElement.initialize();
      }, 400);
    }
  }
  hoverTimers = new WeakMap<any, any>();

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

      swiperEl.initialize();
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
