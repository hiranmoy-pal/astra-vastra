import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Http } from '../../core/services/api/http';
import { Storage } from '../../core/services/storage/storage';
import { Alert } from '../../core/services/alert/alert';
import { Toast } from '../../core/services/toast/toast';

@Component({
  selector: 'app-common-product-grid',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterLink],
  templateUrl: './common-product-grid.html',
  styleUrl: './common-product-grid.scss',
})
export class CommonProductGrid implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() products: any[] = [];
  @Input() customClass: string = '';

  isLoggedIn: boolean = false;
  hoverTimers = new WeakMap<any, any>();
  resetTimers = new WeakMap<any, any>();

  private authStateSub!: Subscription;

  private http = inject(Http);
  private storage = inject(Storage);
  private alert = inject(Alert);
  private toast = inject(Toast);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.storage.get('accessToken').then(token => {
        this.zone.run(() => {
          this.isLoggedIn = !!token;
          this.cdr.detectChanges();
        });
      });

      this.authStateSub = this.http.authStateChange$.subscribe((status) => {
        this.zone.run(() => {
          this.isLoggedIn = status;
          this.cdr.detectChanges();
        });
      });
    }
  }

  ngOnDestroy() {
    if (this.authStateSub) this.authStateSub.unsubscribe();
  }

  async toggleWishlist(event: Event, product: any) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isLoggedIn) {
      const isConfirmed = await this.alert.show({
        title: 'Login Required',
        message: 'You have to login to add items to your wishlist.',
        confirmText: 'Login',
        cancelText: 'Cancel'
      });

      if (isConfirmed) {
        this.router.navigate(['/login']);
      }
      return;
    }

    if (!product.isWishlist) {
      this.http.addToWishlist({ productId: [Number(product.productId)] }).subscribe({
        next: (res: any) => {
          this.zone.run(() => {
            if (res.status) {
              product.isWishlist = true;
              // this.toast.show(res.message || 'Added to wishlist', 'success');
            } else {
              this.toast.show(res.message || 'Failed to add to wishlist', 'error');
            }
            this.cdr.detectChanges();
          });
        },
        error: () => {
          this.zone.run(() => {
            this.toast.show('Something went wrong. Please try again!', 'error');
            this.cdr.detectChanges();
          });
        }
      });
    } else {
      this.toast.show('Go to wishlist', 'warning');
      // const isConfirmed = await this.alert.show({
      //   title: 'Remove from Wishlist',
      //   message: 'Are you sure you want to remove this item from your wishlist?',
      //   confirmText: 'Remove',
      //   cancelText: 'Cancel',
      //   isDanger: true
      // });

      // if (!isConfirmed) return;

      // this.http.removeWishlistItems(product.productId).subscribe({
      //   next: (res: any) => {
      //     this.zone.run(() => {
      //       if (res.status) {
      //         product.isWishlist = false;
      //         this.toast.show(res.message || 'Removed from wishlist', 'success');
      //       } else {
      //         this.toast.show(res.message || 'Failed to remove from wishlist', 'error');
      //       }
      //       this.cdr.detectChanges();
      //     });
      //   },
      //   error: () => {
      //     this.zone.run(() => {
      //       this.toast.show('Something went wrong. Please try again!', 'error');
      //       this.cdr.detectChanges();
      //     });
      //   }
      // });
    }
  }

  startSwiper(event: any) {
    const container = event.currentTarget as HTMLElement;
    const swiperEl: any = container.querySelector('swiper-container');
    if (!swiperEl) return;

    // Cancel pending reset if user re-hovers quickly
    if (this.resetTimers.has(container)) {
      clearTimeout(this.resetTimers.get(container));
      this.resetTimers.delete(container);
    }

    // Initialize only once by checking the actual .swiper instance
    if (!swiperEl.swiper) {
      Object.assign(swiperEl, {
        loop: true,
        speed: 500,
        autoplay: { delay: 1500, disableOnInteraction: false },
        pagination: { clickable: true }
      });
      swiperEl.initialize();
      swiperEl.swiper?.autoplay?.stop();
    }

    const swiper = swiperEl.swiper;
    if (!swiper) return;

    swiper.autoplay.stop();

    if (this.hoverTimers.has(container)) {
      clearTimeout(this.hoverTimers.get(container));
    }

    const timer = setTimeout(() => {
      container.classList.add('swiper-active');
      swiper.autoplay.start();
    }, 300);

    this.hoverTimers.set(container, timer);
  }

  resetSwiper(event: any) {
    const container = event.currentTarget as HTMLElement;
    const swiperEl: any = container.querySelector('swiper-container');
    const swiper = swiperEl?.swiper;

    if (this.hoverTimers.has(container)) {
      clearTimeout(this.hoverTimers.get(container));
      this.hoverTimers.delete(container);
    }

    container.classList.remove('swiper-active');

    if (swiper) {
      swiper.autoplay.stop();

      // Wait until the 0.3s fade-out finishes before resetting to slide 0
      const resetTimer = setTimeout(() => {
        swiper.slideToLoop(0, 0);
        this.resetTimers.delete(container);
      }, 320);

      this.resetTimers.set(container, resetTimer);
    }
  }

}