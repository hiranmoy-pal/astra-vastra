import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { Theme } from '../../core/services/theme/theme';
import { Toast } from '../../core/services/toast/toast';
import { Loading } from '../../core/services/loading/loading';
import { RouterLink, RouterModule } from '@angular/router';


@Component({
  selector: 'app-category-list',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    Header, Footer, CommonModule, RouterModule, RouterLink
  ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList implements OnInit, AfterViewInit {

  categories: any = [
    { title: 'Ethnic Wear', offer: '50-80% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/sari/s/y/w/free-tiranga9601-smc-sareemall-unstitched-original-imah8eqbkzewzq6z.jpeg?q=60' },
    { title: 'Casual Wear', offer: '40-80% OFF', image: 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/5/2/q/-original-imahgcs8chzjtsmz.jpeg?q=90' },
    { title: "Men's Activewear", offer: '30-70% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/lingerie-set/n/y/y/36-sh-kes-4g-li-dp36-arvaan-collective-original-imahjghjycpreeqp.jpeg?q=70' },
    { title: "Women's Activewear", offer: '30-70% OFF', image: 'https://rukminim1.flixcart.com/fk-p-flap/700/920/image/900d3a154290e527.png?q=60' },
    { title: 'Western Wear', offer: '40-80% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/top/d/t/9/l-1-crop-top-bw-xs-chroma-style-original-imahhvarxbrpdyyf.jpeg?q=60' },
    { title: 'Sportswear', offer: '30-80% OFF', image: 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/k/c/6/-original-imahjhjpv7txxxsu.jpeg?q=90' },
    { title: 'Sleepwear', offer: '50-70% OFF', image: 'https://rukminim1.flixcart.com/fk-p-flap/700/1060/image/2edef08631cc5d3f.jpg?q=60' },
    { title: 'Western Wear', offer: '40-80% OFF', image: 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/a/v/4/34-v4nbrs-maroon-34-pack-1-vanila-original-imahkyjmfyppzts7.jpeg?q=90' },
    { title: 'Sportswear', offer: '30-80% OFF', image: 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/m/l/-original-imahjhjpzftwmgbb.jpeg?q=90' },
    { title: 'Sleepwear', offer: '50-70% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/ethnic-set/i/g/b/3xl-jokp-5144olive-jompers-original-imahdnukqz5eyhhv.jpeg?q=70' },
    { title: 'Innerwear', offer: '40-60% OFF', image: 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/lingerie-set/d/a/6/30-sfh100-lpl-limewide-original-imagzeqsfsv9khay.jpeg?q=90' },
    { title: 'Western Wear', offer: '40-80% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shirt/x/w/6/s-st112-vebnor-original-imahhfzgagf4zzaj.jpeg?q=70' },
    { title: 'Sportswear', offer: '30-80% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shirt/x/p/0/-original-imaghkfu8hm4gxbh.jpeg?q=70' },
    { title: 'Sleepwear', offer: '50-70% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shirt/0/e/e/l-vbn-m-487-elvaro-original-imahkbrkhj6pycg4.jpeg?q=70' },
    { title: 'Innerwear', offer: '40-60% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/lingerie-set/v/d/j/28-prnt-set-2100-fasharious-original-imahh4kqfppbvkcj.jpeg?q=70' },
    { title: 'Innerwear', offer: '40-60% OFF', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/ethnic-set/g/g/i/xxl-jokp-p-5006blue-jompers-original-imagrvh7wfpytphe.jpeg?q=70' }
  ];

  constructor(
    public themeService: Theme,
    public toastService: Toast,
    public loadingService: Loading,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit() {
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 2000);
  }

  ngAfterViewInit() { }
}


