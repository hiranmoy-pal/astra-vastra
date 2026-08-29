import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { Theme } from '../../core/services/theme/theme';
import { Toast } from '../../core/services/toast/toast';
import { Loading } from '../../core/services/loading/loading';
import { RouterLink, RouterModule } from '@angular/router';
import { Http } from '../../core/services/api/http';
import { CommonProductSwiper } from '../../layout/common-product-swiper/common-product-swiper';
import { CommonProductGrid } from '../../layout/common-product-grid/common-product-grid';
import { CommonCategory } from '../../layout/common-category/common-category';

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

export class Home implements OnInit, AfterViewInit {

  @ViewChild('swiperRefBanner') swiperRefBanner!: ElementRef;
  @ViewChild('swiperRefBrand') swiperRefBrand!: ElementRef;
  hoverTimers = new WeakMap<any, any>();


  banners = [
    'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/d17697e94e3af1ff.jpg?q=60',
    'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/5017a43fc014e1f6.png?q=60',
    'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/c966eebea8d80fcb.png?q=60',
    'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/4e25a99384af1be3.png?q=60',
    'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/428ea77977271cc4.png?q=60'
  ];

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

  categories: any = [
    { "id": 3100, "name": "Boys Clothing", "image": "https://m.media-amazon.com/images/G/31/img19/Apparel/KA/GW/Sub-Nav/2._CB469401627_.jpg", "path": "boy-clothing" },
    { "id": 3200, "name": "Girls Clothing", "image": "https://m.media-amazon.com/images/G/31/img19/Apparel/KA/GW/Sub-Nav/girls._CB469401626_.jpg", "path": "girl-clothing" },
    { "id": 3300, "name": "Footwear", "image": "https://assets.myntassets.com/f_webp,dpr_1.5,q_60,w_210,c_limit,fl_progressive/assets/images/2026/JULY/24/nSJ3HglB_f961fb26091e413c90d31d10b07f411d.jpg", "path": "kids-footwear" },
    { "id": 3400, "name": "Toys & Games", "image": "https://assets.myntassets.com/f_webp,dpr_2.0,q_60,w_210,c_limit,fl_progressive/assets/images/2026/JANUARY/30/PDEUZWeo_5146578cfad24decbb1ed8fe41568374.jpg", "path": "toys-and-games" },
    { "id": 3500, "name": "Infants", "image": "https://assets.myntassets.com/f_webp,dpr_2.0,q_60,w_210,c_limit,fl_progressive/assets/images/2026/JUNE/5/SsSUB4Cr_186dedbce5384855a000bfc74e380a6b.jpg", "path": "Infants" },
    { "id": 3600, "name": "Kids Accessories", "image": "https://assets.myntassets.com/f_webp,dpr_2.0,q_60,w_210,c_limit,fl_progressive/assets/images/2025/SEPTEMBER/20/pSPyA36f_85b5c36d55ec4201b4b3ecf0063cec8a.jpg", "path": "kids-accessories" },
    { "id": 3403, "name": "Soft Toys", "image": "https://assets.myntassets.com/f_webp,dpr_2.0,q_60,w_210,c_limit,fl_progressive/assets/images/2025/SEPTEMBER/26/Jg13GWpQ_04dc87c53c7948438a04d65ce40c2a07.jpg", "path": "kids-soft-toys" },
    { "id": 3501, "name": "Bodysuits", "image": "https://assets.myntassets.com/f_webp,dpr_2.0,q_60,w_210,c_limit,fl_progressive/assets/images/2026/APRIL/7/Mx1klLS6_32c935625de64ade839aa3739414aeb7.jpg", "path": "kids-bodysuits" },
    { "id": 3502, "name": "Rompers & Sleepsuits", "image": "https://assets.myntassets.com/f_webp,dpr_2.0,q_60,w_210,c_limit,fl_progressive/assets/images/2026/AUGUST/17/aee29e18245449a4afabe79114a000b8.jpg", "path": "kids-rompers-and-sleepsuits" },
    { "id": 3601, "name": "Bags & Backpacks", "image": "https://assets.myntassets.com/f_webp,dpr_2.0,q_60,w_210,c_limit,fl_progressive/assets/images/2026/JULY/6/15fnIJSo_0af9475072af434e8b016df6074b44de.jpg", "path": "kids-bags-and-backpacks" },
    { "id": 3602, "name": "Watches", "image": "https://assets.myntassets.com/f_webp,dpr_2.0,q_60,w_210,c_limit,fl_progressive/assets/images/2025/AUGUST/26/RMg5Zj8S_a13cb22cac6640ebb7c208cadeb67950.jpg", "path": "kids-watches" },
    { "id": 3603, "name": "Jewellery & Hair accessory", "image": "https://assets.myntassets.com/f_webp,dpr_2.0,q_60,w_210,c_limit,fl_progressive/assets/images/2025/DECEMBER/4/mlaqp089_6237aee069c1427899846ff4d6c4a5db.jpg", "path": "kids-jewellery-and-hair-accessory" }
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
    private http: Http,
    public themeService: Theme,
    public toastService: Toast,
    public loadingService: Loading,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit() {

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
