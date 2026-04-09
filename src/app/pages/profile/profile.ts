import { Component, inject } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { ProfileMenu } from '../../layout/profile-menu/profile-menu';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    Header, Footer, ProfileMenu, CommonModule, RouterModule, RouterLink, ReactiveFormsModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  isEdit = false;


  constructor() { }

  private fb = inject(FormBuilder);

  form = this.fb.group({
    firstName: ['Julianne'],
    lastName: ['Moore'],
    gender: ['Female'],
    dob: ['1995-01-01'],
    mobile: ['9876543210'],
    email: ['julianne@mail.com'],
    location: ['Kolkata'],
    pincode: ['700044']
  });


  originalValue = this.form.value;

  enableEdit() {
    this.isEdit = true;
  }

  save() {
    this.isEdit = false;
    this.originalValue = this.form.value;
  }

  cancel() {
    this.form.patchValue(this.originalValue);
    this.isEdit = false;
  }
}
