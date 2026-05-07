import { Component } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ProfileMenu } from '../../layout/profile-menu/profile-menu';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ordered-list',
  standalone: true,
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink, ProfileMenu, ReactiveFormsModule
  ],
  templateUrl: './ordered-list.html',
  styleUrl: './ordered-list.scss',
})
export class OrderedList { }
