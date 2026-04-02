import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Header,Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
