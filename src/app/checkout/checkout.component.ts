import {Component, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {CartService} from '../cart.service';
import {PaymentService} from '../payment.service';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';

@Pipe({name: 'checkoutPipe'})
export class CheckoutPipe implements PipeTransform {
  transform(value: number, args: string[]): any {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [CartService, PaymentService]
})
export class CheckoutComponent implements OnInit {

  public data: any;
  public i = 0;
  public body: any;
  public subtotal = 0;
  public total = 0;
  public taxes = 0;
  public count = 0;
  public currency: any;
  public dataResponse: any;

  public paymentForm = this.formBuilder.group({
    merchantId: ['', Validators.required],
    accountId: ['', Validators.required],
    description: ['', Validators.required],
    referenceCode: ['', Validators.required],
    amount: ['', Validators.required],
    tax: ['', Validators.required],
    taxReturnBase: ['', Validators.required],
    currency: ['', Validators.required],
    signature: ['', Validators.required],
    test: ['', Validators.required],
    buyerEmail: ['', Validators.required],
    responseUrl: ['', Validators.required],
    confirmationUrl: ['', Validators.required]
  });

  constructor(public cartServices: CartService,
              public paymentService: PaymentService,
              public formBuilder: FormBuilder,
              private _service: NotificationsService,
              private router: Router) {
  }

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
              this.subtotal = (this.data[this.i].unitary_price * this.data[this.i].quantity) + this.subtotal;
              this.taxes = (this.data[this.i].unitary_price * (this.data[this.i].tax / 100) * this.data[this.i].quantity) + this.taxes;
              this.currency = this.data[this.i].currency;
              this.count++;
            }
            this.total = this.subtotal + this.taxes;
            this.total.toFixed(2);
            this.taxes.toFixed(2);
            this.subtotal.toFixed(2);
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
          this.sendPaymentData();
        }
      );
  }

  sendPaymentData() {
    this.body = {
      amount: this.total,
      tax: this.taxes,
      taxReturnBase: this.subtotal,
      currency: this.currency
    };
    return this.paymentService.paymentService(this.body)
      .subscribe(
        response => {
          if (response) {
            this.dataResponse = response;
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
}
