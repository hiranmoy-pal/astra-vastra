import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-common-category',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './common-category.html',
  styleUrl: './common-category.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CommonCategory {
  @Input() heading: string = 'Shop By Category';
  @Input() data: any[] = [];
  @Input() customClass: string = '';
}
