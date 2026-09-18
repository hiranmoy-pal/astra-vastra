import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ProfileMenu } from '../../layout/profile-menu/profile-menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonProductGrid } from '../../layout/common-product-grid/common-product-grid';
import { CommonProductListLayout } from '../../layout/common-product-list-layout/common-product-list-layout';

@Component({
  selector: 'app-search',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink, ProfileMenu, FormsModule, ReactiveFormsModule, CommonProductGrid, CommonProductListLayout
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnInit, AfterViewInit {
  hoverTimers = new WeakMap<any, any>();
  selectedDiscount = 25;
  minPrice = 3000;
  maxPrice = 18000;
  maxRange = 20000;
  isFilterOpen: boolean = false;

  categories = [
    { name: 'Evening Wear', count: 142, selected: false },
    { name: 'Knitwear', count: 86, selected: true },
    { name: 'Outerwear', count: 210, selected: false },
  ];

  brands = [
    { name: 'Atelier Essentials', count: 412, selected: false },
    { name: 'Modern Heritage', count: 195, selected: false },
    { name: 'Signature Line', count: 284, selected: false },
  ];

  genders = [
    { name: 'Women', count: 845, selected: true },
    { name: 'Men', count: 403, selected: false },
    { name: 'Unisex', count: 156, selected: false },
  ];

  colors = [
    { name: 'Midnight', code: '#111111', count: 212, selected: false },
    { name: 'Burgundy', code: '#720036', count: 89, selected: true },
    { name: 'Oatmeal', code: '#E5D3B3', count: 145, selected: false },
    { name: 'Ivory', code: '#F8F5EE', count: 98, selected: false },
  ];

  sizes = [
    { name: 'XS', selected: false },
    { name: 'S', selected: true },
    { name: 'M', selected: true },
    { name: 'L', selected: false },
    { name: 'XL', selected: false },
  ];

  ratings = [
    { name: '4+ Stars', selected: false },
    { name: '3+ Stars', selected: false },
  ];

  discounts = [
    { label: '10% Off or more', value: 10 },
    { label: '25% Off or more', value: 25 },
    { label: '50% Off or more', value: 50 },
  ];


  products = [
    {
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit Round Neck Leg Suit Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    },
    {
      brand: 'Keepfit',
      name: 'Round Neck Leg Suit',
      price: 1398,
      original: 3499,
      discount: '(60% OFF)',
      size: 'S, M, L',
      rating: 4.7,
      count: '31',
      images: [
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90',
        'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90'
      ]
    }
  ];


  ngOnInit(): void {

  }
  ngAfterViewInit(): void {

  }

  fetchFilteredProducts() {
    console.log("API CALL TRIGGERED: Fetching new products based on updated filters!");
    // Later, you will gather selected IDs and pass them to your Service here.
  }
}
