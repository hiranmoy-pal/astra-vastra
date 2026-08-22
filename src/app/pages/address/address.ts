import { Component, inject, OnInit, OnDestroy, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ProfileMenu } from '../../layout/profile-menu/profile-menu';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Http } from '../../core/services/api/http';
import { Toast } from '../../core/services/toast/toast';
import { Subscription } from 'rxjs';
import { Alert } from '../../core/services/alert/alert';
import { Storage } from '../../core/services/storage/storage';
import { CommonMessege } from '../../layout/common-messege/common-messege';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink, ProfileMenu, ReactiveFormsModule,
    CommonMessege
  ],
  templateUrl: './address.html',
  styleUrl: './address.scss',
})
export class Address implements OnInit, OnDestroy {
  addresses: any[] = [];
  isLoading: boolean = false; // Start false to prevent initial clash
  isModalOpen: boolean = false;
  isEditMode: boolean = false;

  // Auth Tracking States
  isAuthChecked: boolean = false;
  isLoggedIn: boolean = false;

  currentEditId: number | null = null;
  originalAddressIsDefault: boolean = false;
  addressTypes: any[] = [];
  postOffices: any[] = [];

  private pinCodeSub!: Subscription;
  private authStateSub!: Subscription;
  pendingPostOffice: string | null = null;

  private fb = inject(NonNullableFormBuilder);
  private http = inject(Http);
  private toast = inject(Toast);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private storage = inject(Storage);

  addressForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    address: ['', [Validators.required]],
    addressType: ['', [Validators.required]],
    pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    postOffice: [{ value: '', disabled: true }, [Validators.required]],
    district: [{ value: '', disabled: true }, [Validators.required]],
    state: [{ value: '', disabled: true }, [Validators.required]],
    landmark: ['', [Validators.required]],
    isDefault: [false]
  });

  constructor(private alertService: Alert) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // 1. Check auth state safely
      this.checkAuthAndLoadData();

      // 2. Safely listen to logout events so it doesn't crash Angular
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
    if (this.pinCodeSub) this.pinCodeSub.unsubscribe();
    if (this.authStateSub) this.authStateSub.unsubscribe();
  }

  checkAuthAndLoadData() {
    this.storage.get('accessToken').then(token => {
      // Push the state updates to the next frame to avoid NG0100
      setTimeout(() => {
        this.isAuthChecked = true;

        if (token) {
          this.isLoggedIn = true;
          this.getAddressesList();
          this.getAddressType();
          this.setupPincodeListener();
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
          if (res.status && res.data) {
            this.addresses = res.data;
          } else {
            this.addresses = [];
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        setTimeout(() => {
          this.toast.show('Failed to load addresses', 'error');
          this.addresses = [];
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  getAddressType() {
    this.http.getAddressTypes().subscribe({
      next: (res: any) => {
        if (res.status && res.data) {
          this.addressTypes = res.data;
        } else {
          this.addressTypes = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.addressTypes = [];
        this.cdr.detectChanges();
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

  setupPincodeListener() {
    this.pinCodeSub = this.addressForm.get('pincode')!.valueChanges.subscribe((val: string) => {
      if (val && val.toString().length === 6) {
        this.getLocationDetails(val);
      } else {
        this.postOffices = [];
        this.addressForm.get('postOffice')?.disable({ emitEvent: false });
        this.addressForm.patchValue({ postOffice: '', district: '', state: '' }, { emitEvent: false });
      }
    });
  }

  getLocationDetails(pincode: any) {
    this.http.getLocation(pincode).subscribe({
      next: (res: any) => {
        setTimeout(() => {
          if (res && res[0] && res[0].Status === 'Success' && res[0].PostOffice) {
            this.postOffices = res[0].PostOffice;
            this.addressForm.get('postOffice')?.enable({ emitEvent: false });
            const firstPO = this.postOffices[0];

            this.addressForm.patchValue({
              district: firstPO.District,
              state: firstPO.State
            }, { emitEvent: false });

            if (this.pendingPostOffice) {
              const exactMatch = this.postOffices.find(
                po => po.Name.toLowerCase() === this.pendingPostOffice!.toLowerCase()
              );
              this.addressForm.patchValue({
                postOffice: exactMatch ? exactMatch.Name : this.pendingPostOffice
              }, { emitEvent: false });
              this.pendingPostOffice = null;
            } else if (this.postOffices.length === 1) {
              this.addressForm.patchValue({ postOffice: firstPO.Name }, { emitEvent: false });
            } else {
              this.addressForm.patchValue({ postOffice: '' }, { emitEvent: false });
            }
          } else {
            this.toast.show('Invalid Pincode', 'error');
            this.postOffices = [];
            this.addressForm.get('postOffice')?.disable({ emitEvent: false });
            this.addressForm.patchValue({ postOffice: '', district: '', state: '' }, { emitEvent: false });
          }
          this.cdr.detectChanges();
        }, 0);
      },
      error: () => {
        setTimeout(() => {
          this.toast.show('Failed to fetch location details', 'error');
        }, 0);
      }
    });
  }

  openModal(address?: any) {
    this.postOffices = [];
    this.currentEditId = null;
    this.pendingPostOffice = null;
    this.originalAddressIsDefault = false;

    this.addressForm.reset({}, { emitEvent: false });
    this.addressForm.get('postOffice')?.disable({ emitEvent: false });
    this.addressForm.get('district')?.disable({ emitEvent: false });
    this.addressForm.get('state')?.disable({ emitEvent: false });

    if (address) {
      this.isEditMode = true;
      this.currentEditId = address.addressId;
      this.pendingPostOffice = address.postOffice || null;
      this.originalAddressIsDefault = address.default === true || address.isDefault === true;

      let rawPhone = address.phone || '';
      if (rawPhone.startsWith('+91-')) rawPhone = rawPhone.replace('+91-', '');
      else if (rawPhone.startsWith('+91')) rawPhone = rawPhone.replace('+91', '');

      this.addressForm.patchValue({
        firstName: address.firstName,
        lastName: address.lastName,
        phone: rawPhone.trim(),
        address: address.address,
        addressType: address.addressType,
        pincode: address.pinCode,
        landmark: address.landmark,
        isDefault: this.originalAddressIsDefault
      }, { emitEvent: false });

      if (address.pinCode) {
        this.getLocationDetails(address.pinCode);
      }
    } else {
      this.isEditMode = false;
      const isFirstAddress = this.addresses.length === 0;
      this.addressForm.patchValue({ isDefault: isFirstAddress }, { emitEvent: false });
    }

    document.body.classList.add('modal-open');
    this.isModalOpen = true;
  }

  handleDefaultClick(event: Event) {
    if (!this.isEditMode && this.addresses.length === 0) {
      event.preventDefault();
      this.toast.show('Your first address must be the default address.', 'warning');
      return;
    }
    if (this.isEditMode && this.originalAddressIsDefault) {
      event.preventDefault();
      if (this.addresses.length <= 1) {
        this.toast.show('Add a new address to remove this address default.', 'warning');
      } else {
        this.toast.show('Make another address your default to automatically remove this one.', 'warning');
      }
    }
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.classList.remove('modal-open');
  }

  saveAddress() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      this.toast.show('Please fill all mandatory fields correctly.', 'error');
      return;
    }
    const value = this.addressForm.getRawValue();
    const selectedType = this.addressTypes.find(t => t.name === value.addressType);
    const addressTypeId = selectedType ? selectedType.id : 1;

    const payload: any = {
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      phone: value.phone.trim(),
      address: value.address.trim(),
      addressType: addressTypeId,
      postOffice: value.postOffice,
      district: value.district,
      state: value.state,
      landmark: value.landmark.trim(),
      pinCode: Number(value.pincode),
      isDefault: value.isDefault
    };

    if (this.isEditMode && this.currentEditId) {
      payload.addressId = this.currentEditId;
    }

    this.saveAddressAPI(payload);
  }

  saveAddressAPI(payload: any) {
    this.http.saveAddress(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.show(res.message, 'success');
          this.getAddressesList();
          this.closeModal();
        } else {
          this.toast.show(res.message, 'error');
        }
      },
      error: (err) => this.toast.show('Error saving address', 'error')
    });
  }

  async deleteAddress(address: any) {
    if (address.isDefault || address.default) {
      this.toast.show('Default address cannot be deleted.', 'error');
      return;
    }
    const isConfirmed = await this.alertService.show({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this address?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDanger: true
    });
    if (!isConfirmed) {
      return;
    }
    const payload: any = {
      addressId: address.addressId
    }
    this.http.deleteAddress(payload).subscribe({
      next: async (res: any) => {
        if (res.status) {
          this.toast.show(res.message, 'success');
          this.getAddressesList();
        } else {
          this.toast.show(res.message, 'error');
        }
      },
      error: async () => {
        this.toast.show('Something went wrong, Please try again.', 'error');
      }
    });
  }
}