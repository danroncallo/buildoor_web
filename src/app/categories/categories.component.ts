import {Component, OnInit, ViewChild} from '@angular/core';
import {CategoriesService} from '../categories.service';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {Router} from "@angular/router";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  providers: [CategoriesService]
})

export class CategoriesComponent implements OnInit {

  public categories: any;
  public id;
  public data;
  public product;
  public save: boolean;
  public check: boolean;
  public categorySign: any = 'up';
  public useSign: any = 'up';
  public uses;
  public categoriesArray: any[] = [];
  public usesArray: any[] = [];
  public catArray: any[] = [];
  public useArray: any[] = [];
  public filterQuery = '';
  public rowsOnPage = 10;
  public sortBy = 'name';
  public sortOrder = 'desc';
  private body: any;
  private files = [];

  public categoryForm = this.formBuilder.group({
    name: ['', Validators.required],
    id: ['', Validators.required],
  });

  constructor(public categoriesServices: CategoriesService, public formBuilder: FormBuilder, private _service: NotificationsService,  private router: Router) { }

  ngOnInit() {
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

  getCategories() {
    return this.categoriesServices.getCategories()
      .subscribe(
        response => {
          if (response) {
            this.data = response.categories;
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

  getCategory(id) {
    return this.categoriesServices.getCategory(id)
      .subscribe(
        response => {
          if (response) {
            this.categoryForm = this.formBuilder.group({
              name: response.category.name,
              id: response.category.id
            });
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
  }

  buttonTrue() {
    this.save = true;
    this.categoryForm.reset();
  }

  buttonFalse() {
    this.save = false;
    this.categoryForm.reset();
  }

  deleteCategory(id) {
    return this.categoriesServices.deleteCategory(id)
      .subscribe(
        response => {
          if (response) {
            this.getCategories();
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

  submitForm() {
    this.body = {
      name: this.categoryForm.value.name
    };
    return this.categoriesServices.saveCategory(this.body)
      .subscribe(
        response => {
          if (response) {
            this.categoryForm.reset();
            this.hideChildModal();
            this.getCategories();
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

  updateForm() {
    this.body = {
      name: this.categoryForm.value.name
    };
    this.id = this.categoryForm.value.id;
    return this.categoriesServices.updateCategory(this.id, this.body)
      .subscribe(
        response => {
          if (response) {
            this.categoryForm.reset();
            this.hideChildModal();
            this.getCategories();
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

}
