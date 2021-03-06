import { Component, OnInit } from '@angular/core';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-card-carousel-3',
  templateUrl: './card-carousel-3.component.html',
  styleUrls: ['./card-carousel.component.css']
})
export class CardCarousel3Component {

  products: Product[];

  selectedProduct: Product;

  timeToRestock = <Product[]>[];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.getProducts();
  }

  onSelect(product: Product): void {
    this.selectedProduct = product;
  }

  getProducts(): void {
    this.productService.getProducts()
      .subscribe(products => this.products = products);
    this.getTimeToRestock(this.timeToRestock);
    this.carousel(this.timeToRestock);
  }

  getTimeToRestock(timeToRestock: Product[]): void {
    this.products.forEach(function (product) {
      if (product.promotion.includes('time to restock')) {
        timeToRestock.push(product);
      }
    });
  }

  carousel(products: Product[]) {
    $(document).ready(function () {
      $('#carousel-3').on('slide.bs.carousel', function (e) {
        const $e = $((e as any).relatedTarget);
        const idx = $e.index();
        const itemsPerSlide = 4;
        const totalItems = products.length;
        if (idx >= totalItems - (itemsPerSlide - 1)) {
          const it = itemsPerSlide - (totalItems - idx);
          for (let i = 0; i < it; i++) {
            // append slides to end
            if ((e as any).direction === 'left') {
              $('#c3')
                .eq(i)
                .appendTo('.inner-3');
            } else {
              $('#c3')
                .eq(0)
                .appendTo($(this).find('.inner-3'));
            }
          }
        }
      });
    });
  }
}
