import { AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit, PLATFORM_ID, NgZone } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ProfileMenu } from '../../layout/profile-menu/profile-menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Toast } from '../../core/services/toast/toast';
import { Loading } from '../../core/services/loading/loading';
import { Subscription } from 'rxjs';
import { Http } from '../../core/services/api/http';
import { Storage } from '../../core/services/storage/storage';
import { Alert } from '../../core/services/alert/alert';
import { CommonMessege } from '../../layout/common-messege/common-messege';

@Component({
  selector: 'app-cart',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink, ProfileMenu, ReactiveFormsModule, FormsModule, CommonMessege
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit, AfterViewInit, OnDestroy {

  isAuthChecked: boolean = false;
  isLoggedIn: boolean = false;
  isCartLoading: boolean = true; // 🔥 ADDED: Tracks the API loading state

  cartData: any = null;
  selectionPayload: { cartItemId: number; selected: boolean }[] = [];

  private authStateSub!: Subscription;
  private http = inject(Http);
  private toast = inject(Toast);
  private loading = inject(Loading);
  private alert = inject(Alert);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private storage = inject(Storage);
  private zone = inject(NgZone);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthAndLoadData();

      this.authStateSub = this.http.authStateChange$.subscribe((loggedInStatus) => {
        this.zone.run(() => {
          this.isLoggedIn = loggedInStatus;
          if (this.isLoggedIn) {
            this.fetchCartList();
          } else {
            this.cartData = null;
            this.isCartLoading = false;
          }
          this.cdr.detectChanges();
        });
      });
    }
  }

  ngOnDestroy() {
    if (this.authStateSub) this.authStateSub.unsubscribe();
  }

  checkAuthAndLoadData() {
    this.storage.get('accessToken').then(token => {
      this.zone.run(() => {
        this.isAuthChecked = true;
        this.isLoggedIn = !!token;
        if (this.isLoggedIn) {
          this.fetchCartList();
        } else {
          this.isCartLoading = false; // Turn off loader if logged out
        }
        this.cdr.detectChanges();
      });
    });
  }

  fetchCartList() {
    this.loading.show();
    this.cartData = null;
    this.isCartLoading = true;
    this.http.getCartList(this.selectionPayload).subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          if (res.status && res.data) {
            this.cartData = res.data;
            this.isCartLoading = false;
            this.loading.hide();
            this.cdr.detectChanges();
          } else {
            this.cartData = { items: [] };
            this.isCartLoading = false;
            this.loading.hide();
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.zone.run(() => {
          this.isCartLoading = false;
          this.loading.hide();
          this.toast.show('Failed to load cart', 'error');
          this.cdr.detectChanges();
        });
      }
    });
  }


  toggleItemSelection(cartItemId: number, event: any) {
    const isSelected = event.target.checked;
    const existingIndex = this.selectionPayload.findIndex(p => p.cartItemId === cartItemId);

    if (existingIndex > -1) {
      this.selectionPayload[existingIndex].selected = isSelected;
    } else {
      this.selectionPayload.push({ cartItemId, selected: isSelected });
    }
    this.fetchCartList();
  }

  toggleAllSelections(event: any) {
    const isSelected = event.target.checked;
    if (this.cartData && this.cartData.items) {
      this.cartData.items.forEach((item: any) => {
        const existingIndex = this.selectionPayload.findIndex(p => p.cartItemId === item.cartItemId);
        if (existingIndex > -1) {
          this.selectionPayload[existingIndex].selected = isSelected;
        } else {
          this.selectionPayload.push({ cartItemId: item.cartItemId, selected: isSelected });
        }
      });
    }
    this.fetchCartList();
  }

  getSelectedVariant(item: any) {
    if (!item.sizes || !item.sizes.length) return null;
    return item.sizes.find((s: any) => s.selectedSize) || item.sizes[0];
  }

  getQuantityArray(stock: number): number[] {
    const max = stock > 10 ? 10 : stock;
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  onSizeChange(item: any, event: any) {
    const newVariantId = Number(event.target.value);
    const payload = {
      cartItemId: item.cartItemId,
      productId: item.productId,
      variantId: newVariantId,
      quantity: item.quantity
    };
    this.executeAddToCart(payload);
  }

  onQuantityChange(item: any, event: any) {
    const newQty = Number(event.target.value);
    const variant = this.getSelectedVariant(item);
    if (!variant) return;

    const payload = {
      cartItemId: item.cartItemId,
      productId: item.productId,
      variantId: variant.variantId,
      quantity: newQty
    };
    this.executeAddToCart(payload);
  }

  executeAddToCart(payload: any) {
    this.loading.show();
    this.http.updateCart(payload).subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          if (res.status) {
            this.toast.show(res.message, 'success');
            this.fetchCartList();
          } else {
            this.toast.show(res.message, 'error');
            this.fetchCartList();
            this.loading.hide();
          }
        });
      },
      error: () => {
        this.zone.run(() => {
          this.toast.show('Something went wrong', 'error');
          this.fetchCartList();
          this.loading.hide();
        });
      }
    });
  }

  async removeSelectedItems() {
    const selectedIds = this.cartData?.items?.filter((i: any) => i.selected).map((i: any) => i.cartItemId) || [];
    if (!selectedIds.length) {
      this.toast.show('Please select at least one item to remove', 'warning');
      return;
    }

    const isConfirmed = await this.alert.show({
      title: 'Remove Items',
      message: 'Are you sure you want to remove the selected items from your cart?',
      confirmText: 'Remove',
      cancelText: 'Cancel',
      isDanger: true
    });

    if (isConfirmed) {
      this.executeRemove(selectedIds);
    }
  }

  async removeCartItem(cartItemId: number) {
    const isConfirmed = await this.alert.show({
      title: 'Remove Item',
      message: 'Are you sure you want to remove this item from your cart?',
      confirmText: 'Remove',
      cancelText: 'Cancel',
      isDanger: true
    });

    if (isConfirmed) {
      this.executeRemove([cartItemId]);
    }
  }

  executeRemove(ids: number[]) {
    this.loading.show();
    this.http.removeCartItems({ cartItemId: ids }).subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          this.fetchCartList();
          this.toast.show(res.message, 'success');
        });
      },
      error: () => {
        this.zone.run(() => {
          this.loading.hide();
          this.toast.show('Failed to remove item', 'error');
        });
      }
    });
  }

  async moveToWishlistSelected() {
    const selectedIds = this.cartData?.items?.filter((i: any) => i.selected) || [];
    if (!selectedIds.length) {
      this.toast.show('Please select items first', 'warning');
      return;
    }
    await this.alert.show({
      title: 'Move to Wishlist',
      message: 'Are you sure you want to move selected items to your wishlist?',
      confirmText: 'Move',
      cancelText: 'Cancel'
    });
  }

  ngAfterViewInit() { }
}