import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ProfileMenu } from '../../layout/profile-menu/profile-menu';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink, ProfileMenu, ReactiveFormsModule
  ],
  templateUrl: './address.html',
  styleUrl: './address.scss',
})
export class Address {
  addresses: any = [
    {
      name: 'Julianne Moore',
      type: 'home',
      default: true,
      address: '725 5th Avenue, Trump Tower, Apt 66, New York, NY 10022, United States',
      phone: '+1 (212) 555-0198'
    },
    {
      name: 'Digital Atelier HQ',
      type: 'work',
      default: false,
      address: '1140 Broadway, Floor 15, Suite 1502, New York, NY 10001, United States',
      phone: '+1 (212) 555-0450'
    },
    {
      name: 'Julianne Moore',
      type: 'home',
      default: true,
      address: '725 5th Avenue, Trump Tower, Apt 66, New York, NY 10022, United States',
      phone: '+1 (212) 555-0198'
    },
    {
      name: 'Digital Atelier HQ',
      type: 'work',
      default: false,
      address: '1140 Broadway, Floor 15, Suite 1502, New York, NY 10001, United States',
      phone: '+1 (212) 555-0450'
    }
  ];

  private fb = inject(NonNullableFormBuilder);
  isModalOpen: boolean = false;
  isEditMode: boolean = false;

  addressForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required]],
    city: [''],
    state: [''],
    pincode: [''],
    landmark: [''],
    type: ['home' as 'home' | 'office'],
    default: [false]
  });

  openAdd() {
    this.isEditMode = false;
    document.body.classList.add('modal-open');
    this.addressForm.reset({
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      type: 'home',
      default: false
    });

    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.classList.remove('modal-open');
  }

  saveAddress() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    const value = this.addressForm.getRawValue();
    console.log('Saved Address:', value);
    this.closeModal();
  }
}
