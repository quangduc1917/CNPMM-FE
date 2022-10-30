import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  idcart!: number;
  items?: any;
  amount !: number;
  total !: number;

  name!: string;
  numberphone!: string;
  address!: string;

  constructor(private auth: AuthService, private token: TokenStorageService,
    private router: Router, private route: ActivatedRoute, private cart: CartService) {
    if (this.token.getToken() == null) {
      alert('You can login!');
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    this.fecthData();

    if (this.token.getToken() != null) {
      this.auth.getUserInfo().subscribe(
        (data) => {
          this.name = data?.name;
          this.numberphone = data?.numberPhone;
          this.address = data?.address;
        }
      );
    }
  }

  fecthData() {
    this.cart.getAll().subscribe(
      (data) => {
        this.items = data;
        this.totalPrice();
      }
    );
  }

  updateAmountItem(event, cartId) {
    const id = cartId;
    const amount = event.target.value;
    this.cart.updateCart(id, amount).subscribe(
      (data) => {
        this.fecthData();
      }
    );
  }

  deleteItem(cartId) {
    this.cart.deleteCart(cartId).subscribe(
      (data) => {
        this.fecthData();
      }
    );
  }

  totalPrice() {
    let sum = 0;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].state === 0) {
        sum += this.items[i].totalPrice;
      }

    }

    this.total = sum;
  }

  checkOut() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.items.length; i++) {
      this.cart.checkOut(this.items[i].cartId).subscribe();
      this.fecthData();
    }
    window.location.reload();
    alert('Checkout success!');
  }


}
