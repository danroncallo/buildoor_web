import {Component, OnInit, ViewChild} from '@angular/core';
import {UsesService} from '../uses.service';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {Router} from "@angular/router";

@Component({
  selector: 'app-uses',
  templateUrl: './uses.component.html',
  styleUrls: ['./uses.component.css'],
  providers: [UsesService]
})

export class UsesComponent implements OnInit {

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

  public useForm = this.formBuilder.group({
    name: ['', Validators.required],
    id: ['', Validators.required],
  });

  constructor(public usesServices: UsesService, public formBuilder: FormBuilder, private _service: NotificationsService,  private router: Router) { }

  ngOnInit() {
    this.getUses();
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

  getUses() {
    return this.usesServices.getUses()
      .subscribe(
        response => {
          if (response) {
            this.data = response.uses;
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

  getUse(id) {
    return this.usesServices.getUse(id)
      .subscribe(
        response => {
          if (response) {
            this.useForm = this.formBuilder.group({
              name: response.use.name,
              id: response.use.id
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
    this.useForm.reset();
  }

  buttonFalse() {
    this.save = false;
    this.useForm.reset();
  }

  deleteUse(id) {
    return this.usesServices.deleteUse(id)
      .subscribe(
        response => {
          if (response) {
            this.getUses();
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
      name: this.useForm.value.name
    };
    return this.usesServices.saveUse(this.body)
      .subscribe(
        response => {
          if (response) {
            this.useForm.reset();
            this.hideChildModal();
            this.getUses();
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
      name: this.useForm.value.name
    };
    this.id = this.useForm.value.id;
    return this.usesServices.updateUse(this.id, this.body)
      .subscribe(
        response => {
          if (response) {
            this.useForm.reset();
            this.hideChildModal();
            this.getUses();
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
