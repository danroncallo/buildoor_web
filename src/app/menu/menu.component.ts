import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {LoginService} from '../login.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ProductsService} from '../products.service';
import {LocationsService} from '../locations.service';
import {UsersService} from '../users.service';
import {UserProfileComponent} from '../user-profile/user-profile.component';
import {NotificationsService} from 'angular2-notifications';
import {CustomValidators} from 'ng2-validation';
import {FacebookService, InitParams, LoginOptions, LoginResponse} from 'ngx-facebook';
declare const gapi: any;

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [LoginService, ProductsService, LocationsService, UsersService]
})

export class MenuComponent implements OnInit {

  public countries: any;
  public id: any;
  public name: any;
  public last_name: any;
  public states: any;
  public password: any;
  public confirm: any;
  public data: any;
  public valid: boolean;
  public home: boolean;
  public logged: boolean;

  public loginForm = this.formBuilder.group({
    email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEX)])],
    password: ['', Validators.required],
  });

  public emailForm = this.formBuilder.group({
    email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEX)])],
  });

  public registerForm: FormGroup;

  public searchForm = this.formBuilder.group({
    searchInput: ['']
  });

  private body: any;
  private keyword: any;
  private errorMsg: string;

  constructor(public formBuilder: FormBuilder,
              public router: Router,
              public loginService: LoginService,
              public productsService: ProductsService,
              public locationsService: LocationsService,
              public usersService: UsersService,
              private _service: NotificationsService,
              private fb: FacebookService) {

    gapi.load('auth2', function () {
      gapi.auth2.init();
    });

    let initParams: InitParams = {
      appId: '290917938037601',
      xfbml: true,
      version: 'v2.8'
    };
    fb.init(initParams);

    let password = new FormControl('', [Validators.required]);
    let confirm_password = new FormControl('', [Validators.required, CustomValidators.equalTo(password)]);

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      identification: [''],
      birth_date: [''],
      phone: [''],
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEX)])],
      password: password,
      confirm_password: confirm_password,
      profession: [''],
      country: [''],
      state: [''],
      postal_code: [''],
      address: [''],
    });
  }

  ngOnInit() {
    this.showHome();
    this.getCountries();
    this.IsLogged();
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

  showErrorLogin() {
    this._service.error(
      'Oops!',
      'Credenciales Inválidas',
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

  showHome() {
    if (this.router.url === '/') {
      this.home = true;
    } else {
      this.home = false;
    }
  }

  @ViewChild('childModal') public childModal: ModalDirective;

  public showChildModal(): void {
    this.childModal.show();
  }

  public hideChildModal(): void {
    this.childModal.hide();
  }

  @ViewChild('emailModal') public emailModal: ModalDirective;

  public showEmailModal(): void {
    this.emailModal.show();
  }

  public hideEmailModal(): void {
    this.emailModal.hide();
  }

  @ViewChild('registerModal') public registerModal: ModalDirective;

  public showRegisterModal(): void {
    this.registerModal.show();
  }

  public hideRegisterModal(): void {
    this.registerModal.hide();
  }

  getCountries() {
    return this.locationsService.getCountries()
      .subscribe(
        response => {
          if (response) {
            this.countries = response.countries;
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

  getStates(id) {
    return this.locationsService.getStates(id)
      .subscribe(
        response => {
          if (response) {
            this.states = response.states;
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

  saveUser() {
    this.body = {
      name: this.registerForm.value.name,
      last_name: this.registerForm.value.last_name,
      identification: this.registerForm.value.identification,
      birth_date: this.registerForm.value.birth_date,
      phone: this.registerForm.value.phone,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      confirm_password: this.registerForm.value.confirm_password,
      profession: this.registerForm.value.profession,
      country_id: this.registerForm.value.country,
      state: this.registerForm.value.state,
      postal_code: this.registerForm.value.postal_code,
      address: this.registerForm.value.address,
    };
    return this.usersService.saveUsers(this.body)
      .subscribe(
        response => {
          if (response) {
            this.states = response.states;
            localStorage.setItem('auth_token', response.access_token);
            location.reload();
            this.showSuccessNotification();
            this.hideRegisterModal();
          }
        },
        error => {
          this.showErrorNotification();
          this.hideRegisterModal();
        }
      );
  }

  IsLogged() {
    if (localStorage.length > 0) {
      this.logged = true;
      this.getUserByToken();
    }
    if (localStorage.length === 0) {
      this.logged = false;
    }
  }

  areEqual() {
    this.password = this.registerForm.value.password;
    this.confirm = this.registerForm.value.confirm_password;
    if (this.password === this.confirm) {
      this.valid = true;
    } else {
      this.valid = false;
    }
  }

  login() {
    this.body = {
      client_id: 2,
      client_secret: 'Opaa7YeYxnwpqHiwTWbK5YaqCwMZJJ2YnU5hOfOM',
      grant_type: 'password',
      username: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.loginService.login(this.body)
      .subscribe(
        response => {
          if (response) {
            localStorage.setItem('auth_token', response.access_token);
            // this.authenticated = localStorage.getItem('auth_token');
            this.hideChildModal();
            this.showSuccessNotification();
            // location.replace('/');
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
            this.hideChildModal();
          }
          if (error.status === 500) {
            this.showErrorNotification();
            this.hideChildModal();
          }
        },
        () => {
          location.reload();
        }
      );
  }

  getUserByToken() {
    return this.usersService.getUserByToken()
      .subscribe(
        response => {
          if (response) {
            this.id = response.user.id;
            this.name = response.user.name;
            this.last_name = response.user.last_name;
          }
        },
        error => {
          if (error.status === 401) {
            this.logout();
          }
          if (error.status === 403) {
            this.logout();
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

  googleLogin() {
    let googleAuth = gapi.auth2.getAuthInstance();
    googleAuth.then(() => {
      googleAuth.signIn({scope: 'profile email'}).then(googleUser => {
        this.data = googleUser.getBasicProfile();
        let body = {
          name: this.data.ig,
          email: this.data.U3
        };
        this.registerSocialUser(body);
      });
    });
  }

  facebookLogin(): void {
    const options: LoginOptions = {
      scope: 'public_profile, email',
      return_scopes: true,
      enable_profile_selector: true
    };

    this.fb.login(options)
      .then
      ((response: LoginResponse) => {
        this.getFacebookProfile();
      })
      .catch((error: any) => console.error(error));

  }

  getFacebookProfile() {
    this.fb.api('/me')
      .then((res: any) => {
        let body = {
          name: res.name,
          last_name: res.last_name,
          email: res.email
        };
        this.registerSocialUser(body);
      })
      .catch();
  }

  registerSocialUser(body) {
    // this.loggingIn = true;

    this.usersService.registerSocialUser(body)
      .subscribe(
        response => {
          localStorage.setItem('auth_token', response.access_token);
          location.reload();
        },
        error => {
          if (error.status === 500) {
            this.showErrorNotification();
            this.hideChildModal();
          }
          if (error.status === 401) {
            this.showErrorLogin();
            this.hideChildModal();
          }
        },
        () => {
          location.reload();
        }
      );
  }

  logout() {
    localStorage.clear();
    location.replace('/');
  }
}
