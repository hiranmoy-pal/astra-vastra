import { CommonModule, isPlatformBrowser } from '@angular/common'; // <-- Import isPlatformBrowser
import { Component, OnDestroy, OnInit, PLATFORM_ID, inject, ChangeDetectorRef } from '@angular/core'; // <-- Import PLATFORM_ID & CDR
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
  private authStateSub!: Subscription;
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    public themeService: Theme, private storage: Storage, private http: Http, private router: Router,
    private toast: Toast, private alertService: Alert
  ) { }

  ngOnInit() {
    this.isAuthChecked = false;

    if (isPlatformBrowser(this.platformId)) {
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

    // 2. Listen for profile updates (Edit Profile)
    this.profileUpdateSub = this.http.profileUpdate$.subscribe(() => {
      this.getUserProfile();
    });

    // 3. Listen for global login/logout events
    this.authStateSub = this.http.authStateChange$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.getUserProfile();
      } else {
        this.userData = null;
        this.isAuthChecked = true;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    if (this.profileUpdateSub) this.profileUpdateSub.unsubscribe();
    if (this.authStateSub) this.authStateSub.unsubscribe();
  }

  getUserProfile() {
    this.http.getUserProfile().subscribe({
      next: (res: any) => {
        setTimeout(() => {
          if (res.status && res.data) {
            this.userData = res.data;
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