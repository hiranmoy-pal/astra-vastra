import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Http } from '../../core/services/api/http';
import { Toast } from '../../core/services/toast/toast';

@Component({
  selector: 'app-address-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-modal.html',
  styleUrl: './address-modal.scss',
})

export class AddressModal implements OnInit, OnChanges, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() editAddress: any = null;
  @Input() totalAddresses: number = 0;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  isEditMode: boolean = false;
  currentEditId: number | null = null;
  originalAddressIsDefault: boolean = false;
  addressTypes: any[] = [];
  postOffices: any[] = [];
  pendingPostOffice: string | null = null;

  private pinCodeSub!: Subscription;

  private fb = inject(NonNullableFormBuilder);
  private http = inject(Http);
  private toast = inject(Toast);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

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

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getAddressType();
      this.setupPincodeListener();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen) {
      this.initializeForm();
    } else if (changes['isOpen'] && !this.isOpen && isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('modal-open');
    }
  }

  ngOnDestroy() {
    if (this.pinCodeSub) this.pinCodeSub.unsubscribe();
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('modal-open');
    }
  }

  getAddressType() {
    this.http.getAddressTypes().subscribe({
      next: (res: any) => {
        this.addressTypes = res.status && res.data ? res.data : [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.addressTypes = [];
        this.cdr.detectChanges();
      }
    });
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

  initializeForm() {
    this.postOffices = [];
    this.currentEditId = null;
    this.pendingPostOffice = null;
    this.originalAddressIsDefault = false;

    this.addressForm.reset({}, { emitEvent: false });
    this.addressForm.get('postOffice')?.disable({ emitEvent: false });
    this.addressForm.get('district')?.disable({ emitEvent: false });
    this.addressForm.get('state')?.disable({ emitEvent: false });

    if (this.editAddress) {
      this.isEditMode = true;
      this.currentEditId = this.editAddress.addressId;
      this.pendingPostOffice = this.editAddress.postOffice || null;
      this.originalAddressIsDefault = this.editAddress.default === true || this.editAddress.isDefault === true;

      let rawPhone = this.editAddress.phone || '';
      if (rawPhone.startsWith('+91-')) rawPhone = rawPhone.replace('+91-', '');
      else if (rawPhone.startsWith('+91')) rawPhone = rawPhone.replace('+91', '');

      this.addressForm.patchValue({
        firstName: this.editAddress.firstName,
        lastName: this.editAddress.lastName,
        phone: rawPhone.trim(),
        address: this.editAddress.address,
        addressType: this.editAddress.addressType,
        pincode: this.editAddress.pinCode,
        landmark: this.editAddress.landmark,
        isDefault: this.originalAddressIsDefault
      }, { emitEvent: false });

      if (this.editAddress.pinCode) {
        this.getLocationDetails(this.editAddress.pinCode);
      }
    } else {
      this.isEditMode = false;
      const isFirstAddress = this.totalAddresses === 0;
      this.addressForm.patchValue({ isDefault: isFirstAddress }, { emitEvent: false });
    }

    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.add('modal-open');
    }
  }

  handleDefaultClick(event: Event) {
    if (!this.isEditMode && this.totalAddresses === 0) {
      event.preventDefault();
      this.toast.show('Your first address must be the default address.', 'warning');
      return;
    }
    if (this.isEditMode && this.originalAddressIsDefault) {
      event.preventDefault();
      if (this.totalAddresses <= 1) {
        this.toast.show('Add a new address to remove this address default.', 'warning');
      } else {
        this.toast.show('Make another address your default to automatically remove this one.', 'warning');
      }
    }
  }

  closeModal() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('modal-open');
    }
    this.closed.emit();
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

    this.http.saveAddress(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.show(res.message, 'success');
          this.saved.emit();
          this.closeModal();
        } else {
          this.toast.show(res.message, 'error');
        }
      },
      error: () => this.toast.show('Error saving address', 'error')
    });
  }
}
