import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Theme } from '../../core/services/theme/theme';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  menu: string | null = null;
  isProfileOpen: boolean = false;

  constructor(public themeService: Theme) { }

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
