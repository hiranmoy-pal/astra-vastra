import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Theme } from '../../core/services/theme/theme';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
 menu: string | null = null;

 constructor(public themeService: Theme){}

setMenu(menu: string) {
  this.menu = menu;
}

clearMenu() {
  this.menu = null;
}
}
