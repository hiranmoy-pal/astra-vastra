import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ProfileMenu } from '../../layout/profile-menu/profile-menu';
import { Storage } from '../../core/services/storage/storage';
import { Http } from '../../core/services/api/http';
import { Toast } from '../../core/services/toast/toast';
import { Alert } from '../../core/services/alert/alert';
import { CommonMessege } from '../../layout/common-messege/common-messege';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    Header, Footer, ProfileMenu, CommonModule, RouterModule, RouterLink, ReactiveFormsModule, CommonMessege
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Profile implements OnInit, OnDestroy {
  isEdit = false;
  userData: any = null;
  isAuthChecked: boolean = false;
  private authSub!: Subscription;

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  form = this.fb.group({
    firstName: [''],
    lastName: [''],
    gender: [''],
    dob: [''],
    phone: [''],
    email: [''],
    location: [''],
    pinCode: ['']
  });

  constructor(
    private storage: Storage,
    private http: Http,
    private router: Router,
    private toast: Toast,
    private alertService: Alert
  ) { }

  ngOnInit() {
    this.storage.get('accessToken').then(token => {
      setTimeout(() => {
        if (token) {
          this.getUserProfile();
        } else {
          this.userData = null;
          this.isAuthChecked = true;
          this.cdr.detectChanges();
        }
      });
    });
  }

  getUserProfile() {
    this.http.getUserProfile().subscribe({
      next: (res: any) => {
        setTimeout(() => {
          if (res.status && res.data) {
            this.userData = res.data;
            this.form.patchValue(this.userData);
          } else {
            this.userData = null;
          }
          this.isAuthChecked = true;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        setTimeout(() => {
          console.error('Failed to fetch profile', err);
          this.userData = null;
          this.isAuthChecked = true;
          this.cdr.detectChanges();
        });
      }
    });

    this.authSub = this.http.authStateChange$.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        this.userData = null;
        this.isAuthChecked = true;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  enableEdit() {
    this.isEdit = true;
  }

  save() {
    const formVals = this.form.value;
    const payload = {
      firstName: formVals.firstName,
      lastName: formVals.lastName,
      phone: formVals.phone,
      email: formVals.email,
      gender: formVals.gender,
      dob: formVals.dob,
      pinCode: formVals.pinCode ? Number(formVals.pinCode) : null,
      location: formVals.location
    };

    this.http.updateUserProfile(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.isEdit = false;
          this.toast.show(res.message, 'success');
          this.http.clearProfileCache();
          this.getUserProfile();

        } else {
          this.toast.show(res.message || 'Failed to update profile', 'error');
        }
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Failed to update profile', 'error');
      }
    });
  }

  cancel() {
    this.isEdit = false;
    if (this.userData) {
      this.form.patchValue(this.userData);
    }
  }
}