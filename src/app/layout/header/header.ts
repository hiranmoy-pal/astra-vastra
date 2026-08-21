import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Theme } from '../../core/services/theme/theme';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Storage } from '../../core/services/storage/storage';
import { Http } from '../../core/services/api/http';
import { Toast } from '../../core/services/toast/toast';
import { Alert } from '../../core/services/alert/alert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
  menu: string | null = null;
  isProfileOpen: boolean = false;
  userData: any = null;
  isAuthChecked: boolean = false;
  private profileUpdateSub!: Subscription;

  constructor(
    public themeService: Theme, private storage: Storage, private http: Http, private router: Router,
    private toast: Toast, private alertService: Alert
  ) { }


  async ngOnInit() {
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
    this.userData = null;
    this.isProfileOpen = false;
    this.toast.show('Logged out successfully', 'success');
  }

  setMenu(menu: string) {
    this.menu = menu;
  }

  clearMenu() {
    this.menu = null;
  }

  toggleProfile() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  openProfile() {
    this.isProfileOpen = true;
  }

  closeProfile() {
    this.isProfileOpen = false;
  }
}
