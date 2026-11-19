import { AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { CommonMessege } from '../../layout/common-messege/common-messege';
import { Toast } from '../../core/services/toast/toast';
import { Loading } from '../../core/services/loading/loading';
import { Http } from '../../core/services/api/http';
import { Storage } from '../../core/services/storage/storage';
import { Alert } from '../../core/services/alert/alert';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink, CommonMessege
  ],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist implements OnInit, AfterViewInit, OnDestroy {

  isAuthChecked: boolean = false;
  isLoggedIn: boolean = false;
  isWishlistLoading: boolean = true;

  wishlistItems: any[] = [];
  activeSizeDropdownId: number | null = null; // Tracks which card's size dropdown is open

  private authStateSub!: Subscription;
  private http = inject(Http);
  private toast = inject(Toast);
  private loading = inject(Loading);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private storage = inject(Storage);
  private zone = inject(NgZone);
  private alert = inject(Alert);


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthAndLoadData();

      this.authStateSub = this.http.authStateChange$.subscribe((loggedInStatus) => {
        this.zone.run(() => {
          this.isLoggedIn = loggedInStatus;
          if (this.isLoggedIn) {
            this.fetchWishlist();
          } else {
            this.wishlistItems = [];
            this.isWishlistLoading = false;
          }
          this.cdr.detectChanges();
        });
      });
    }
  }

  checkAuthAndLoadData() {
    this.storage.get('accessToken').then(token => {
      this.zone.run(() => {
        this.isAuthChecked = true;
        this.isLoggedIn = !!token;
        if (this.isLoggedIn) {
          this.fetchWishlist();
        } else {
          this.isWishlistLoading = false;
        }
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy() {
    if (this.authStateSub) this.authStateSub.unsubscribe();
  }

  ngAfterViewInit() { }

  fetchWishlist(isInitialLoad: boolean = false) {
    if (isInitialLoad) {
      this.isWishlistLoading = true;
    }

    this.http.getWishlist().subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          if (res.status && res.data) {
            this.wishlistItems = [...res.data];
          } else {
            this.wishlistItems = [];
          }
          this.isWishlistLoading = false;
          this.loading.hide();
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.wishlistItems = [];
          this.isWishlistLoading = false;
          this.loading.hide();
          this.toast.show('Failed to load wishlist', 'error');
          this.cdr.detectChanges();
        });
      }
    });
  }

  getSizesText(sizes: any[]): string {
    if (!sizes || !sizes.length) return '';
    return sizes.map(s => s.size).join(', ');
  }

  toggleSizeDropdown(wishlistItemId: number) {
    this.activeSizeDropdownId = this.activeSizeDropdownId === wishlistItemId ? null : wishlistItemId;
  }

  closeSizeDropdown() {
    this.activeSizeDropdownId = null;
  }

  async removeWishlistItem(productId: number) {
    const isConfirmed = await this.alert.show({
      title: 'Remove from Wishlist',
      message: 'Are you sure you want to remove this item from your wishlist?',
      confirmText: 'Remove',
      cancelText: 'Cancel',
      isDanger: true
    });

    if (!isConfirmed) return;

    this.loading.show();
    this.http.removeWishlistItems(productId).subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          if (res.status) {
            this.toast.show(res.message || 'Removed from wishlist', 'success');
          } else {
            this.toast.show(res.message || 'Failed to remove item', 'error');
          }
          this.fetchWishlist();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.toast.show('Something went wrong', 'error');
          this.fetchWishlist();
        });
      }
    });
  }

  async onSelectSizeAndMoveToCart(item: any, sizeObj: any) {
    if (!sizeObj.inStock) return;

    const isConfirmed = await this.alert.show({
      title: 'Move to Cart',
      message: `Move "${item.productName}" (Size: ${sizeObj.size}) to your cart?`,
      confirmText: 'Move to Cart',
      cancelText: 'Cancel'
    });

    if (!isConfirmed) return;

    const payload = {
      productId: item.productId,
      variantId: sizeObj.variantId,
      quantity: 1
    };

    this.loading.show();
    this.http.addToCart(payload).subscribe({
      next: (cartRes: any) => {
        if (cartRes.status) {
          this.toast.show(cartRes.message || 'Added to cart successfully', 'success');

          this.http.removeWishlistItems(item.productId).subscribe({
            next: () => {
              this.zone.run(() => {
                this.activeSizeDropdownId = null;
                this.fetchWishlist();
              });
            },
            error: () => {
              this.zone.run(() => {
                this.activeSizeDropdownId = null;
                this.fetchWishlist();
              });
            }
          });
        } else {
          this.zone.run(() => {
            this.loading.hide();
            this.toast.show(cartRes.message || 'Failed to add to cart', 'error');
            this.cdr.detectChanges();
          });
        }
      },
      error: () => {
        this.zone.run(() => {
          this.loading.hide();
          this.toast.show('Something went wrong. Please try again!', 'error');
          this.cdr.detectChanges();
        });
      }
    });
  }
}