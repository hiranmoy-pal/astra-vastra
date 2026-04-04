import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
 menu: string | null = null;

setMenu(menu: string) {
  this.menu = menu;
}

clearMenu() {
  this.menu = null;
}
}
