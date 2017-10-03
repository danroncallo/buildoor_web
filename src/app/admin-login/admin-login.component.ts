import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {LoginService} from '../login.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  providers: [LoginService]
})
export class AdminLoginComponent implements OnInit {

  public countries: any;
  public id: any;
  public name: any;
  public last_name: any;
  public states: any;
  public password: any;
  public confirm: any;
  public data: any;
  public body: any;
  public valid: boolean;
  public home: boolean;
  public authenticated: any;
  auth_token: string;

  public loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(public formBuilder: FormBuilder,
              public router: Router,
              public loginService: LoginService,
              private _service: NotificationsService) {
    this.auth_token = (localStorage.getItem('auth_token'));
  }

  ngOnInit() {
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

  error401() {
    this._service.error(
      'Oops!',
      'Credenciales incorrectas',
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

  error403() {
    this._service.error(
      'Oops!',
      'Acceso no permitido',
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

  loginAdmin() {
   this.body = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.loginService.loginAdmin(this.body)
      .subscribe(
        response => {
          if (response) {
            localStorage.setItem('auth_token', response.access_token);
            location.replace('admin');
          }
        },
        error => {
          if (error.status === 401) {
            this.error401();
          }
          if (error.status === 403) {
            this.error403();
          }
          if (error.status === 400) {
            this.showErrorNotification();
          }
          if (error.status === 500) {
            this.showErrorNotification();
          }
        },
      );
  }

  @ViewChild('childModal') public childModal: ModalDirective;

  public showChildModal(): void {
    this.childModal.show();
  }

  public hideChildModal(): void {
    this.childModal.hide();
  }
}
