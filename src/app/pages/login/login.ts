import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, Header, Footer, RouterModule, RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  showLogin: boolean = false;
  showOtp: boolean = false;
  showRegister: boolean = true;

  openOtp() {
    this.showLogin = false;
    this.showRegister = false;
    this.showOtp = true;
  }
}
