import {Component, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {CategoriesService} from '../categories.service';
import {UsesService} from '../uses.service';
import {ProductsService} from '../products.service';
import {FormBuilder, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {CartService} from '../cart.service';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';

@Pipe({name: 'commaSeparatedNumber'})
export class CommaSeparatedNumberPipe implements PipeTransform {
  transform(value: number, args: string[], decimalLength: number = 0): any {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css'],
  providers: [CategoriesService, UsesService, ProductsService, CartService],
})
export class StoresComponent implements OnInit {

  public searchForm = this.formBuilder.group({
    searchInput: ['']
  });

  public priceForm = this.formBuilder.group({
    minPrice: [''],
    maxPrice: ['']
  });

  public categories;
  public uses;
  public data;
  private keyword: any;
  private body: any;

  constructor(private http: Http, public formBuilder: FormBuilder, public router: Router,
              public productsServices: ProductsService, public categoriesServices: CategoriesService,
              public usesServices: UsesService, public cartServices: CartService,
              private _service: NotificationsService) {
  }

  ngOnInit() {
    this.getCategories();
    this.getUses();
    this.getProducts();
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

  showCartNotification() {
    this._service.success(
      'Genial!',
      'Producto agregado al carrito',
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

  filterByPrice() {
    const min = this.priceForm.value.minPrice;
    const max = this.priceForm.value.maxPrice;
    return this.productsServices.filterByPrice(min, max)
      .subscribe(
        response => {
          if (response) {
            this.data = response.products;
          }
        },
        error => {
          this.showErrorNotification();
        }
      );
  }

  getCategories() {
    return this.categoriesServices.getCategoriesStore()
      .subscribe(
        response => {
          if (response) {
            this.categories = response.categories;
          }
        },
        error => {
          this.showErrorNotification();
        }
      );
  }

  getUses() {
    return this.usesServices.getUsesStore()
      .subscribe(
        response => {
          if (response) {
            this.uses = response.uses;
          }
        },
        error => {
          this.showErrorNotification();
        }
      );
  }

  getProducts() {
    return this.productsServices.getProductsStore()
      .subscribe(
        response => {
          if (response) {
            this.data = response.products;
          }
        },
        error => {
          this.showErrorNotification();
        }
      );
  }

  saveToCart(id) {
    this.body = {
      stock_id: id,
      quantity: 1
    };
    this.cartServices.saveCart(this.body)
      .subscribe(
        response => {
          this.showCartNotification();
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

  search() {
    this.keyword = this.searchForm.value.searchInput;
    return this.productsServices.searchProduct(this.keyword)
      .subscribe(
        response => {
          if (response) {
            this.data = response.products;
          }
        },
        error => {
          this.showErrorNotification();
        }
      );
  }

  filterByCategory(id) {
    return this.categoriesServices.filterByCategory(id)
      .subscribe(
        response => {
          if (response) {
            this.data = response.products;
          }
        },
        error => {
          this.showErrorNotification();
        }
      );
  }

  filterByUse(id) {
    return this.usesServices.filterByUse(id)
      .subscribe(
        response => {
          if (response) {
            this.data = response.products;
          }
        },
        error => {
          this.showErrorNotification();
        }
      );
  }

  productDetail(id) {
    if (!id) {
      this.showErrorNotification();
    }
    location.replace('product/detail/' + id);
  };


}
