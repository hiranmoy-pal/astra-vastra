import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  templateUrl: './image-viewer.html',
  styleUrl: './image-viewer.scss',
})
export class ImageViewer implements OnChanges, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() images: string | string[] = [];
  @Input() initialIndex: number = 0;
  @Input() title: string = '';

  @Output() closed = new EventEmitter<void>();

  @ViewChild('viewerSwiper') viewerSwiper!: ElementRef;

  currentIndex: number = 0;
  isZoomed: boolean = false;

  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  get imageList(): string[] {
    if (!this.images) return [];
    return Array.isArray(this.images) ? this.images.filter(Boolean) : [this.images];
  }

  get isMultiple(): boolean {
    return this.imageList.length > 1;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) {
        this.currentIndex = Math.min(
          Math.max(0, this.initialIndex || 0),
          Math.max(0, this.imageList.length - 1)
        );
        this.isZoomed = false;
        this.lockBodyScroll(true);
        this.initViewerSwiper();
      } else {
        this.lockBodyScroll(false);
      }
    }
  }

  ngOnDestroy(): void {
    this.lockBodyScroll(false);
  }

  private lockBodyScroll(lock: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = lock ? 'hidden' : '';
    }
  }

  private initViewerSwiper(): void {
    if (!isPlatformBrowser(this.platformId) || !this.imageList.length) return;

    setTimeout(() => {
      const el = this.viewerSwiper?.nativeElement;
      if (!el) return;

      Object.assign(el, {
        initialSlide: this.currentIndex,
        cssMode: true,
        slidesPerView: 1,
        spaceBetween: 20,
        loop: false,
        zoom: {
          maxRatio: 3,
          minRatio: 1,
          toggle: true,
        },
        navigation: this.isMultiple
          ? { nextEl: '.iv-nav-next', prevEl: '.iv-nav-prev' }
          : false,
      });

      el.initialize();

      const swiper = el.swiper;
      if (swiper) {
        swiper.on('slideChange', () => {
          this.currentIndex = swiper.activeIndex;
          this.isZoomed = false;
          this.cdr.detectChanges();
        });

        swiper.on('zoomChange', (_swiper: any, scale: number) => {
          this.isZoomed = scale > 1;
          this.cdr.detectChanges();
        });
      }
    }, 50);
  }

  zoomIn(): void {
    const swiper = this.viewerSwiper?.nativeElement?.swiper;
    if (swiper?.zoom) {
      swiper.zoom.in();
      this.isZoomed = true;
    }
  }

  zoomOut(): void {
    const swiper = this.viewerSwiper?.nativeElement?.swiper;
    if (swiper?.zoom) {
      swiper.zoom.out();
      this.isZoomed = false;
    }
  }

  toggleZoom(): void {
    if (this.isZoomed) {
      this.zoomOut();
    } else {
      this.zoomIn();
    }
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    const swiper = this.viewerSwiper?.nativeElement?.swiper;
    if (swiper) {
      if (this.isZoomed && swiper.zoom) {
        swiper.zoom.out();
      }
      swiper.slideTo(index);
    }
  }

  close(): void {
    this.isZoomed = false;
    this.lockBodyScroll(false);
    this.closed.emit();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (!this.isOpen) return;

    if (event.key === 'Escape') {
      this.close();
    } else if (event.key === 'ArrowRight' && this.isMultiple) {
      this.viewerSwiper?.nativeElement?.swiper?.slideNext();
    } else if (event.key === 'ArrowLeft' && this.isMultiple) {
      this.viewerSwiper?.nativeElement?.swiper?.slidePrev();
    }
  }
}