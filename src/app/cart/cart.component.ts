import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {CartService} from '../cart.service';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';

@Pipe({name: 'cartPipe'})
export class CartPipe implements PipeTransform {
  transform(value: number, args: string[]): any {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [CartService]
})
export class CartComponent implements OnInit {

  public data;
  public currency;
  public quantity: number;
  public total = 0;
  public subtotal = 0;
  public taxes = 0;
  public body;
  public buy: boolean;
  public i: any = 0;
  public count: any = 0;

  public itemQuantity = this.formBuilder.group({
    number: ['']
  });

  constructor(public formBuilder: FormBuilder, public cartServices: CartService, private router: Router,  private _service: NotificationsService) { }

  ngOnInit() {
    this.getCart();
  }

  showSuccessNotification() {
    this._service.success(
      'Genial!',
      'Operación Exitosa',
      {
        timeOut: 5000,
        position: ['bottom', 'left'],
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        icons: 'success'
      }
    );
  }

  showErrorNotification() {
    this._service.error(
      'Oops!',
      'Ocurrió un error',
      {
        timeOut: 5000,
        position: ['bottom', 'left'],
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        icons: 'error'
      }
    );
  }

  getCart() {
    return this.cartServices.getCart()
      .subscribe(
        response => {
          if (response) {
            this.subtotal = 0;
            this.total = 0;
            this.taxes = 0;
            this.count = 0;
            this.data = response.cart;
            for (this.i = 0; this.i < this.data.length; this.i++) {
              if (this.data[this.i].quantity <= this.data[this.i].stock_quantity) {
                this.subtotal = (this.data[this.i].unitary_price * this.data[this.i].quantity) + this.subtotal;
                this.taxes = (this.data[this.i].unitary_price * (this.data[this.i].tax / 100) * this.data[this.i].quantity) + this.taxes;
                this.currency = this.data[this.i].currency;
                this.count++;
              }
              if (this.count < this.data.length) {
                this.buy = false;
              } else {
                this.buy = true;
              }
            }
            this.total =  this.subtotal + this.taxes;
          }
        },
        error => {
          if (error.status === 401) {
            location.replace('/');
          }
          if (error.status === 403) {
            location.replace('/');
          }
          if (error.status === 400) {
            this.showErrorNotification();
          }
          if (error.status === 500) {
            this.showErrorNotification();
          }
        }
      );
  }

  updateQuantity(id) {
    this.body = {
      quantity: this.itemQuantity.value.number,
    };
    return this.cartServices.updateQuantity(id, this.body)
      .subscribe(
        response => {
          if (response) {
            this.showSuccessNotification();
          }
        },
        error => {
          if (error.status === 401) {
            location.replace('/');
          }
          if (error.status === 403) {
            location.replace('/');
          }
          if (error.status === 400) {
            this.showErrorNotification();
          }
          if (error.status === 500) {
            this.showErrorNotification();
          }
        },
        () => {
          this.getCart();
        }
      );
  }

  addOne(id, quantity) {
    console.log(id);
    this.quantity = quantity + 1;
    console.log(this.quantity);
    this.body = {
      quantity: this.quantity,
    };
    return this.cartServices.updateQuantity(id, this.body)
      .subscribe(
        response => {
          if (response) {
            this.showSuccessNotification();
          }
        },
        error => {
          if (error.status === 401) {
            location.replace('/');
          }
          if (error.status === 403) {
            location.replace('/');
          }
          if (error.status === 400) {
            this.showErrorNotification();
          }
          if (error.status === 500) {
            this.showErrorNotification();
          }
        },
        () => {
          this.getCart();
        }
      );
  }

  productDetail(id) {
    location.replace('product/detail/' + id);
  }

  deleteOne(id, quantity) {
    console.log(id);
    this.quantity = quantity - 1;
    console.log(this.quantity);
    this.body = {
      quantity: this.quantity,
    };
    return this.cartServices.updateQuantity(id, this.body)
      .subscribe(
        response => {
          if (response) {
            this.showSuccessNotification();
          }
        },
        error => {
          if (error.status === 401) {
            location.replace('/');
          }
          if (error.status === 403) {
            location.replace('/');
          }
          if (error.status === 400) {
            this.showErrorNotification();
          }
          if (error.status === 500) {
            this.showErrorNotification();
          }
        },
        () => {
          this.getCart();
        }
      );
  }


  deleteItem(id) {
    return this.cartServices.deleteCartItem(id)
      .subscribe(
        response => {
          if (response) {
            this.showSuccessNotification();
          }
        },
        error => {
          if (error.status === 401) {
            location.replace('/');
          }
          if (error.status === 403) {
            location.replace('/');
          }
          if (error.status === 400) {
            this.showErrorNotification();
          }
          if (error.status === 500) {
            this.showErrorNotification();
          }
        },
        () => {
          this.getCart();
        }
      );
  }

  goToStore() {
    location.replace('store');
  }

  checkout() {
    location.replace('checkout');
  }
}
