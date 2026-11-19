import { Component, inject, OnInit, OnDestroy, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ProfileMenu } from '../../layout/profile-menu/profile-menu';
import { Http } from '../../core/services/api/http';
import { Toast } from '../../core/services/toast/toast';
import { Subscription } from 'rxjs';
import { Alert } from '../../core/services/alert/alert';
import { Storage } from '../../core/services/storage/storage';
import { CommonMessege } from '../../layout/common-messege/common-messege';
import { AddressModal } from '../../layout/address-modal/address-modal';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink, ProfileMenu,
    CommonMessege, AddressModal
  ],
  templateUrl: './address.html',
  styleUrl: './address.scss',
})
export class Address implements OnInit, OnDestroy {
  addresses: any[] = [];
  isLoading: boolean = false;
  isModalOpen: boolean = false;
  selectedAddressForEdit: any = null;

  isAuthChecked: boolean = false;
  isLoggedIn: boolean = false;

  private authStateSub!: Subscription;

  private http = inject(Http);
  private toast = inject(Toast);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private storage = inject(Storage);

  constructor(private alertService: Alert) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthAndLoadData();

      this.authStateSub = this.http.authStateChange$.subscribe((loggedInStatus) => {
        setTimeout(() => {
          this.isLoggedIn = loggedInStatus;
          if (!loggedInStatus) {
            this.addresses = [];
          }
          this.cdr.detectChanges();
        }, 0);
      });
    } else {
      this.isAuthChecked = true;
    }
  }

  ngOnDestroy() {
    if (this.authStateSub) this.authStateSub.unsubscribe();
  }

  checkAuthAndLoadData() {
    this.storage.get('accessToken').then(token => {
      setTimeout(() => {
        this.isAuthChecked = true;
        if (token) {
          this.isLoggedIn = true;
          this.getAddressesList();
        } else {
          this.isLoggedIn = false;
          this.isLoading = false;
        }
        this.cdr.detectChanges();
      }, 0);
    });
  }

  getAddressesList() {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.http.getAddressList().subscribe({
      next: (res: any) => {
        setTimeout(() => {
          this.addresses = res.status && res.data ? res.data : [];
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 0);
      },
      error: () => {
        setTimeout(() => {
          this.toast.show('Failed to load addresses', 'error');
          this.addresses = [];
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  getAddressIcon(addressType: string): string {
    if (!addressType) return 'fa-map-marker';
    const type = addressType.toLowerCase();
    if (type.includes('permanent') || type.includes('home')) return 'fa-home';
    if (type.includes('present') || type.includes('current')) return 'fa-map-marker';
    if (type.includes('office') || type.includes('registered')) return 'fa-building';
    if (type.includes('shipping')) return 'fa-truck';
    if (type.includes('factory') || type.includes('warehouse')) return 'fa-industry';
    if (type.includes('correspondence')) return 'fa-envelope';
    return 'fa-address-card';
  }

  openModal(address?: any) {
    this.selectedAddressForEdit = address || null;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedAddressForEdit = null;
  }

  async deleteAddress(address: any) {
    if (address.isDefault || address.default) {
      this.toast.show('Default address cannot be deleted.', 'warning');
      return;
    }
    const isConfirmed = await this.alertService.show({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this address?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDanger: true
    });
    if (!isConfirmed) return;

    this.http.deleteAddress({ addressId: address.addressId }).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.show(res.message, 'success');
          this.getAddressesList();
        } else {
          this.toast.show(res.message, 'error');
        }
      },
      error: () => {
        this.toast.show('Something went wrong, Please try again.', 'error');
      }
    });
  }
}