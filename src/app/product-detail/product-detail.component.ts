import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductsService} from '../products.service';
import {FormBuilder} from '@angular/forms';
import {CartService} from '../cart.service';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [ProductsService, CartService]
})
export class ProductDetailComponent implements OnInit {

  public itemQuantity = this.formBuilder.group({
    number: ['']
  });

  id: number;
  sub: any;
  public data: any;
  public quantity: any;
  public body: any;
  public isDataReady: boolean = false;

  constructor(private route: ActivatedRoute,
              public productsServices: ProductsService,
              public formBuilder: FormBuilder,
              public cartServices: CartService,
              private _service: NotificationsService,
              private router: Router) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.getProduct(this.id);
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

  showLoginNotification() {
    this._service.error(
      'Oops!',
      'Inicia sesión para realizar esta operación',
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

  getProduct(id) {
    return this.productsServices.getProductByIdStore(id)
      .subscribe(
        response => {
          if (response) {
            this.data = response.product;
            this.quantity = 1;
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
          this.isDataReady = true;
        }
      );
  }

  saveToCart(id) {
    this.quantity = this.itemQuantity.value.number;
    console.log(this.quantity);
    this.body = {
      stock_id: id,
      quantity: this.quantity
    };
    this.cartServices.saveCart(this.body)
      .subscribe(
        response => {
          this.showSuccessNotification();
        },
        error => {
          if (error.status === 401) {
            this.showLoginNotification();
          }
          if (error.status === 403) {
            this.showLoginNotification();
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

  goToStore() {
    location.replace('store');
  }
}
