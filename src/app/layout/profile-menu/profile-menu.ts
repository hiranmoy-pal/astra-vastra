import { Component, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink
  ],
  templateUrl: './profile-menu.html',
  styleUrl: './profile-menu.scss',
})
export class ProfileMenu implements OnInit {
  url: string = "";
  constructor(private router: Router) {

  }
  ngOnInit() {
    this.url = this.router.url;
  }
}
