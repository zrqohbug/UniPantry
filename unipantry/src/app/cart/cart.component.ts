import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../product';
import { AccountService } from '../profile/account.service';
import { Account } from '../profile/account';
import { Address } from '../profile/address';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements AfterViewInit, OnInit {

  cart: Product[] = [];

  productDict = {};

  cartQuantity = 0;

  total = 0;

  giftCredit: number;

  giftCreditUsed = false;

  subtotal = 0;

  totalRemaining = 30;

  i = 0;

  private account: Account;

  constructor(private cartService: CartService, private accountService: AccountService) {
    accountService.getAccount().subscribe(account => this.account = account);
   }

  ngOnInit() {
    this.getCart();
  }

  ngAfterViewInit() {
    this.setQuantities(-1, this.cart, this.productDict);
    let i: number;
    for (i = 0; i < this.cart.length; i++) {
      this.setQuantities(i, this.cart, this.productDict);
    }
  }

  getCart() {
    this.cartService.getCart()
      .subscribe(cart => {
        this.cart = cart['cart'];
        this.productDict = cart['dict'];
        this.cartQuantity = cart['quantity'];
        this.total = cart['total'];
        this.giftCredit = cart['credit'];
        this.subtotal = cart['subtotal'];
      });
    if (this.giftCredit > this.total) {
      this.giftCredit = this.total;
    }
    this.totalRemaining = 30 - this.total;
  }

  removeFromCart(product: Product, quantity: number) {
    if (quantity >= this.productDict[product.name]) {
      this.removeAll(product);
      return;
    }
    this.cartService.removeFromCart(product, quantity);
    this.getCart();
    const index = this.cart.indexOf(product);
    if (index !== -1) {
      this.setQuantities(index, this.cart, this.productDict);
    }
  }

  removeAll(product: Product) {
    this.cartService.removeAll(product);
    this.getCart();
    this.setQuantities(-1, this.cart, this.productDict);
  }

  useGiftCredit() {
    this.giftCreditUsed = true;
  }

  addToCart(product: Product, quantity: number) {
    this.cartService.addToCart(product, quantity);
    this.getCart();
    this.setQuantities(this.cart.indexOf(product), this.cart, this.productDict);
  }

  updateQuantity(product: Product) {
    const index = this.cart.indexOf(product);
    const newQuantity = (document.querySelectorAll('.quantity')[index] as any).value;
    const difference = newQuantity - this.productDict[product.name];
    if (difference === 0) {
      return;
    } else if (difference > 0) {
      this.addToCart(product, difference);
    } else {
      this.removeFromCart(product, -difference);
    }
  }

  setQuantities(index: number, cart: Product[], productDict: {}) {
    (document.getElementById('cart-quantity') as any).textContent = this.cartQuantity;
    if (index !== -1) {
      const checkExist = setInterval(function () {
        if (document.querySelectorAll('.quantity').length === cart.length) {
          const query = document.querySelectorAll('.quantity');
          (query[index] as any).value = productDict[cart[index].name];
          clearInterval(checkExist);
        }
      }, 100);
    }
  }

  addNote(product: Product) {
    const str = '<textarea style="border-radius: .75vw; color: #F89833; width: 90%;" placeholder="Click to add" maxlength="70"></textarea>';
    const Obj = document.querySelectorAll('.add-note')[this.cart.indexOf(product)];
    if (Obj.innerHTML) {
      Obj.innerHTML = str;
    }
  }

  switchAddress() {
    const numAddresses = this.account.shipping.length;
    if (this.i + 1 >= numAddresses) {
      this.i = 0;
    } else {
      this.i++;
    }
  }

  newAddress() {
    return;
  }
}
