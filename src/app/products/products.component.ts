import {Component, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Http} from '@angular/http';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ProductsService} from '../products.service';
import {UsesService} from '../uses.service';
import {CategoriesService} from '../categories.service';
import {forEach} from '@angular/router/src/utils/collection';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {BehaviorSubject, Subject} from "rxjs";
import {NotificationsService} from 'angular2-notifications';

@Pipe({name: 'productPipe'})
export class ProductPipe implements PipeTransform {
  transform(value: number, args: string[]): any {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [ProductsService, UsesService, CategoriesService]
})
export class ProductsComponent implements OnInit {

  categoriesArray: number[];
  usesArray: number[];
  categories: IMultiSelectOption[];
  uses: IMultiSelectOption[];

  public productsForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    categoriesInput: [''],
    usesInput: [''],
    price: ['', Validators.required],
    tax: ['', Validators.required],
    id: [''],
    input_images: ['']
  });

  public itemQuantity = this.formBuilder.group({
    number: ['']
  });

  public id;
  public data;
  public product;
  public save: boolean;
  public check: boolean;
  public catArray: any[] = [];
  public useArray: any[] = [];
  public filterQuery = '';
  public rowsOnPage = 10;
  public sortBy = 'name';
  public sortOrder = 'desc';
  private body: any;
  private files = [];
  public images = [];
  public productId;
  public loading$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: Http, public formBuilder: FormBuilder, public router: Router,
              public productsServices: ProductsService, public categoriesServices: CategoriesService,
              public usesServices: UsesService, private _service: NotificationsService) {
  }

  onChange() {
    console.log(this.categoriesArray);
    console.log(this.usesArray);
  }

  ngOnInit(): void {
    this.getProducts();
    this.getUses();
    this.getCategories();
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

  getProducts() {
    return this.productsServices.getProducts()
      .subscribe(
        response => {
          if (response) {
            this.data = response.products;
            console.log(this.data);
          }
        },
        error => {
          if (error.status === 401) {
            location.replace('login');
          }
          if (error.status === 403) {
            location.replace('login');
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

  getCategories() {
    return this.categoriesServices.getCategories()
      .subscribe(
        response => {
          if (response) {
            this.categories = response.categories;
          }
        },
        error => {
          if (error.status === 401) {
            location.replace('login');
          }
          if (error.status === 403) {
            location.replace('login');
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

  getUses() {
    return this.usesServices.getUses()
      .subscribe(
        response => {
          if (response) {
            this.uses = response.uses;
          }
        },
        error => {
          if (error.status === 401) {
            location.replace('login');
          }
          if (error.status === 403) {
            location.replace('login');
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

  @ViewChild('childModal') public childModal: ModalDirective;

  public showChildModal(): void {
    this.childModal.show();
  }

  public hideChildModal(): void {
    this.childModal.hide();
    this.productsForm.reset();
    this.categoriesArray = [];
    this.usesArray = [];
  }

  @ViewChild('getProductModal') public getProductModal: ModalDirective;

  public showGetProductModal() {
    this.getProductModal.show();
  }

  public hideGetProductModal(): void {
    this.getProductModal.hide();
  }

  submitForm() {
    this.loading$.next(true);
    this.body = {
      name: this.productsForm.value.name,
      description: this.productsForm.value.description,
      price: this.productsForm.value.price,
      tax: this.productsForm.value.tax,
      categories: this.categoriesArray,
      uses: this.usesArray,
    };
    this.productsServices.saveProducts(this.body)
      .subscribe(
        response => {
          if (this.files.length > 0) {
            let product_id = response.product;
            this.productsServices.saveProductImage(this.files, product_id)
              .subscribe(
                response => {
                  this.showSuccessNotification();
                },
                error => {
                  this.loading$.next(false);
                  if (error.status === 401) {
                    location.replace('login');
                  }
                  if (error.status === 403) {
                    location.replace('login');
                  }
                  if (error.status === 400) {
                    this.showErrorNotification();
                  }
                  if (error.status === 500) {
                    this.showErrorNotification();
                  }
                },
                () => {
                  this.loading$.next(false);
                  location.reload();
                }
              );
          }
          this.productsForm.reset();
          this.categoriesArray = [];
          this.usesArray = [];
          this.getProducts();
          this.hideChildModal();
        },
        error => {
          if (error.status === 401) {
            location.replace('login');
          }
          if (error.status === 403) {
            location.replace('login');
          }
          if (error.status === 400) {
            this.showErrorNotification();
          }
          if (error.status === 500) {
            this.showErrorNotification();
          }
        },
        () => {
          // location.reload();
        }
      );
  }

  productImages(event) {
    this.files.push(event.file);
  }

  imageRemoved(event) {
    let index = this.files.indexOf(event.file);
    this.files.splice(index, 1);
  }

  cancelButton() {
    this.productsForm.reset();
    this.categoriesArray = [];
    this.usesArray = [];
    this.hideChildModal();
  }

  getProductUpdate(id) {
    return this.productsServices.getProductById(id)
      .subscribe(
        response => {
          if (response) {
            this.catArray = [];
            this.useArray = [];
            for (const category in response.categories) {
              this.catArray.push(response.categories[category].id);
            }
            for (const use in response.uses) {
              this.useArray.push(response.uses[use].id);
            }
            this.productsForm = this.formBuilder.group({
              name: response.product.name,
              description: response.product.description,
              price: response.product.price,
              tax: response.product.tax,
              id: id
            });
            this.categoriesArray = this.catArray;
            this.usesArray = this.useArray;
            this.images = response.images;
            this.productId = response.product.id;
            this.showSuccessNotification();
          }
        },
        error => {
          if (error.status === 401) {
            location.replace('login');
          }
          if (error.status === 403) {
            location.replace('login');
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

  getProduct(id) {
    return this.productsServices.getProduct(id)
      .subscribe(
        response => {
          if (response) {
            this.product = response;
            setTimeout(() => {
              this.showGetProductModal();
            }, 500);
          }
        },
        error => {
          if (error.status === 401) {
            location.replace('login');
          }
          if (error.status === 403) {
            location.replace('login');
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

  buttonTrue() {
    this.save = true;
    this.productsForm.reset();
  }

  buttonFalse() {
    this.save = false;
    this.productsForm.reset();
  }

  updateForm() {
    this.body = {
      name: this.productsForm.value.name,
      description: this.productsForm.value.description,
      price: this.productsForm.value.price,
      tax: this.productsForm.value.tax,
      categories: this.categoriesArray,
      uses: this.usesArray
    };
    this.id = this.productsForm.value.id;
    this.productsServices.updateProducts(this.id, this.body)
      .subscribe(
        response => {
          if (this.files.length > 0) {
            let product_id = this.productId;
            this.productsServices.saveProductImage(this.files, product_id)
              .subscribe(
                response => {
                  this.showSuccessNotification();
                },
                error => {
                  this.loading$.next(false);
                  if (error.status === 401) {
                    location.replace('login');
                  }
                  if (error.status === 403) {
                    location.replace('login');
                  }
                  if (error.status === 400) {
                    this.showErrorNotification();
                  }
                  if (error.status === 500) {
                    this.showErrorNotification();
                  }
                },
                () => {
                  this.loading$.next(false);
                  location.reload();
                }
              );
          }
          this.productsForm.reset();
          this.categoriesArray = [];
          this.usesArray = [];
          this.hideChildModal();
          this.getProducts();
        },
        error => {
          if (error.status === 401) {
            location.replace('login');
          }
          if (error.status === 403) {
            location.replace('login');
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
    return this.productsServices.updateQuantity(id, this.body)
      .subscribe(
        response => {
          if (response) {
            this.getProducts();
            this.showSuccessNotification();
          }
        },
        error => {
          if (error.status === 401) {
            location.replace('login');
          }
          if (error.status === 403) {
            location.replace('login');
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

  removeImage(id) {
    return this.productsServices.removeImage(id)
      .subscribe(
        response => {
            this.hideChildModal();
            this.showSuccessNotification();
        },
        error => {
          if (error.status === 401) {
            location.replace('login');
          }
          if (error.status === 403) {
            location.replace('login');
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

  updateStatus(id) {
    this.productsServices.updateStatus(id)
      .subscribe(
        response => {
          this.getProducts();
          this.showSuccessNotification();
        },
        error => {
          if (error.status === 401) {
            location.replace('login');
          }
          if (error.status === 403) {
            location.replace('login');
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
