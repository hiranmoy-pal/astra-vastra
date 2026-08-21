import { Component, OnDestroy, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Theme } from '../../core/services/theme/theme';
import { Http } from '../../core/services/api/http';
import { Alert } from '../../core/services/alert/alert';
import { Toast } from '../../core/services/toast/toast';
import { Storage } from '../../core/services/storage/storage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink
  ],
  templateUrl: './profile-menu.html',
  styleUrl: './profile-menu.scss',
})
export class ProfileMenu implements OnInit, OnDestroy {
  url: string = "";
  userData: any = null;
  isAuthChecked: boolean = false;
  private profileUpdateSub!: Subscription;

  constructor(private router: Router, public themeService: Theme, private storage: Storage, private http: Http,
    private toast: Toast, private alertService: Alert
  ) {

  }

  async ngOnInit() {
    this.url = this.router.url;
    const token = await this.storage.get('accessToken');
    if (token) {
      this.getUserProfile();
    } else {
      this.userData = null;
      this.isAuthChecked = true;
    }
    this.profileUpdateSub = this.http.profileUpdate$.subscribe(() => {
      this.getUserProfile();
    });
  }

  ngOnDestroy() {
    if (this.profileUpdateSub) {
      this.profileUpdateSub.unsubscribe();
    }
  }

  getUserProfile() {
    this.http.getUserProfile().subscribe({
      next: (res: any) => {
        if (res.status && res.data) {
          this.userData = res.data;
        } else {
          this.userData = null;
        }
        this.isAuthChecked = true;
      },
      error: (err) => {
        console.error('Failed to fetch profile', err);
        this.userData = null;
        this.isAuthChecked = true;
      }
    });
  }

  async onLogoutClick() {
    const isConfirmed = await this.alertService.show({
      title: 'Confirm Logout',
      message: 'Are you sure you want to log out of your account?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      isDanger: true
    });
    if (!isConfirmed) {
      return;
    }
    this.http.logoutUserProfile().subscribe({
      next: async () => {
        await this.clearSession();
      },
      error: async () => {
        await this.clearSession();
      }
    });
  }

  async clearSession() {
    this.http.clearProfileCache();
    this.http.authStateChange$.next(false);
    await this.storage.remove('accessToken');
    await this.storage.remove('refreshToken');
    this.toast.show('Logged out successfully', 'success');
  }
}
