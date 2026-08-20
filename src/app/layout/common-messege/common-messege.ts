import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-common-messege',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './common-messege.html',
  styleUrl: './common-messege.scss',
})
export class CommonMessege {
  heading = input.required<string>();
  message = input.required<string>();
  buttonText = input.required<string>();
  buttonLink = input.required<string>();
  iconClass = input.required<string>();
}
