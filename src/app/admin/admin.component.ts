import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AdminLoginComponent} from '../admin-login/admin-login.component';
import {LoginService} from '../login.service';
import {UsersService} from '../users.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [AdminLoginComponent, LoginService, UsersService, NotificationsService]
})
export class AdminComponent implements OnInit {

  public admin: boolean;
  public logged: boolean;

  constructor(private router: Router,
              public adminLogin: AdminLoginComponent,
              public loginService: LoginService,
              public userService: UsersService,
              private _service: NotificationsService) {

  }

  ngOnInit() {
    this.IsLogged();
    this.showDashboard();
  }

  showDashboard() {
    if (this.router.url === '/admin') {
      this.admin = true;
    } else {
      this.admin = false;
    }
  }

  logoutFromAdmin() {
    localStorage.removeItem('auth_token');
    location.replace('login');
  }

  IsLogged() {
    if (localStorage.length > 0) {
      this.logged = true;
      this.getAdminByToken();
    }
    if (localStorage.length === 0) {
      this.logged = false;
      location.replace('login');
    }
  }

  getAdminByToken() {
    return this.userService.getAdminByToken()
      .subscribe(
        response => {
          if (response) {

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
}

