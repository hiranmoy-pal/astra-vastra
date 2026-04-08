import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ProfileMenu } from '../../layout/profile-menu/profile-menu';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink, ProfileMenu
  ],
  templateUrl: './address.html',
  styleUrl: './address.scss',
})
export class Address { }
