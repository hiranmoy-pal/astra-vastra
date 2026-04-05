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
  banners = [
    'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/d17697e94e3af1ff.jpg?q=60',
    'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/5017a43fc014e1f6.png?q=60',
    'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/c966eebea8d80fcb.png?q=60',
    'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/4e25a99384af1be3.png?q=60',
    'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/428ea77977271cc4.png?q=60'
  ];

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
        slidesPerView: 1.3
      },
      1200: {
        slidesPerView: 1.7
      },
      1280: {
        slidesPerView: 1.7
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
      }, 400);
    }
  }
}
