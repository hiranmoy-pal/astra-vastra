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
    { title: 'Casual Wear', offer: '40-80% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/top/d/t/9/l-1-crop-top-bw-xs-chroma-style-original-imahhvarxbrpdyyf.jpeg?q=60' },
    { title: "Men's Activewear", offer: '30-70% OFF', image: 'https://rukminim1.flixcart.com/fk-p-flap/700/1060/image/2edef08631cc5d3f.jpg?q=60' },
    { title: "Women's Activewear", offer: '30-70% OFF', image: 'https://rukminim1.flixcart.com/fk-p-flap/700/920/image/900d3a154290e527.png?q=60' },
    { title: 'Western Wear', offer: '40-80% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/top/d/t/9/l-1-crop-top-bw-xs-chroma-style-original-imahhvarxbrpdyyf.jpeg?q=60' },
    { title: 'Sportswear', offer: '30-80% OFF', image: 'https://rukminim1.flixcart.com/fk-p-flap/700/1060/image/2edef08631cc5d3f.jpg?q=60' },
    { title: 'Sleepwear', offer: '50-70% OFF', image: 'https://rukminim1.flixcart.com/fk-p-flap/700/1060/image/2edef08631cc5d3f.jpg?q=60' },
    { title: 'Western Wear', offer: '40-80% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/top/d/t/9/l-1-crop-top-bw-xs-chroma-style-original-imahhvarxbrpdyyf.jpeg?q=60' },
    { title: 'Sportswear', offer: '30-80% OFF', image: 'https://rukminim1.flixcart.com/fk-p-flap/700/1060/image/2edef08631cc5d3f.jpg?q=60' },
    { title: 'Sleepwear', offer: '50-70% OFF', image: 'https://rukminim1.flixcart.com/fk-p-flap/700/1060/image/2edef08631cc5d3f.jpg?q=60' },
    { title: 'Innerwear', offer: '40-60% OFF', image: 'https://rukminim1.flixcart.com/fk-p-flap/700/1060/image/2edef08631cc5d3f.jpg?q=60' },
    { title: 'Western Wear', offer: '40-80% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/top/d/t/9/l-1-crop-top-bw-xs-chroma-style-original-imahhvarxbrpdyyf.jpeg?q=60' },
    { title: 'Sportswear', offer: '30-80% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/bra/j/9/l/non-padded-36c-1-multiway-yes-regular-ts101b-ingrid-resized-2-original-imahcwwaesubeh6y.jpeg?q=70' },
    { title: 'Sleepwear', offer: '50-70% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/bra/j/9/l/non-padded-36c-1-multiway-yes-regular-ts101b-ingrid-resized-2-original-imahcwwaesubeh6y.jpeg?q=70' },
    { title: 'Innerwear', offer: '40-60% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/bra/j/9/l/non-padded-36c-1-multiway-yes-regular-ts101b-ingrid-resized-2-original-imahcwwaesubeh6y.jpeg?q=70' },
    { title: 'Innerwear', offer: '40-60% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/bra/j/9/l/non-padded-36c-1-multiway-yes-regular-ts101b-ingrid-resized-2-original-imahcwwaesubeh6y.jpeg?q=70' }
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
}
