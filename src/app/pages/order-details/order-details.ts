import { Component } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ProfileMenu } from '../../layout/profile-menu/profile-menu';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink, ProfileMenu, ReactiveFormsModule
  ],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss',
})
export class OrderDetails { }
