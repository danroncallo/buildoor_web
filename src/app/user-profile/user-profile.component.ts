import {Component, OnInit, ViewChild, EventEmitter, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {CustomValidators} from 'ng2-validation';
import {UsersService} from '../users.service';
import {LocationsService} from '../locations.service';
import {PortfolioService} from '../portfolio.service';
import {BehaviorSubject, Subject} from "rxjs";
import {FileHolder} from 'angular2-image-upload/lib/image-upload/image-upload.component';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import { DatePipe } from '@angular/common';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [UsersService, LocationsService, PortfolioService]
})
export class UserProfileComponent implements OnInit {

  public edit: boolean = false;
  public changePassword: boolean = false;
  public addWorks: boolean = false;
  public profile: boolean = true;
  public private: any;
  public id: any;
  public body: any;
  public portfolio: any;
  public data: any;
  public countries: any;
  public states: any;
  public password: any;
  public confirm: any;
  public valid: boolean;
  public selected_country: any;
  public selected_state: any;
  private files = [];

  private avatar: FileList;
  private changePasswordForm: FormGroup;
  private invalidData: boolean = false;
  public loading$: Subject<boolean> = new BehaviorSubject<boolean>(false);
  private image: any;
  public isDataAvailable: boolean = false;
  public isDataReady: boolean = false;

  private images: any = [];

  constructor(public formBuilder: FormBuilder,
              public userServices: UsersService, public router: Router,
              public locationsService: LocationsService,
              public portfolioService: PortfolioService, private _service: NotificationsService) {


    let password = new FormControl('', [Validators.required]);
    let confirm_password = new FormControl('', [Validators.required, CustomValidators.equalTo(password)]);

    this.changePasswordForm = this.formBuilder.group({
      old_password: ['', Validators.required],
      new_password: password,
      confirm_password: confirm_password
    });
  }

  public registerForm = this.formBuilder.group({
    name: ['', Validators.required],
    last_name: ['', Validators.required],
    identification: [''],
    birth_date: [''],
    phone: [''],
    email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEX)])],
    profession: [''],
    country: [''],
    state: [''],
    postal_code: [''],
    address: [''],
  });

  public portfolioForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    imagesUpload: ['']
  });

  ngOnInit() {
    this.getUserByToken();
    this.getCountries();
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

  deleteFile(file: FileHolder): void {
    let index = this.files.indexOf(file);
    this.files.splice(index, 1);
  }

  getUserByToken() {
    return this.userServices.getUserByToken()
      .subscribe(
        response => {
          if (response) {
            this.id = response.user.id;
            this.data = response.user;
            this.image = response.image
            this.registerForm = this.formBuilder.group({
              name: this.data.name,
              last_name: this.data.last_name,
              identification: this.data.identification,
              birth_date: this.data.birth_date,
              phone: this.data.phone,
              email: this.data.email,
              profession: this.data.profession,
              country:  this.data.country == null ? "No Especificado" : this.data.country.name,
              state: this.data.state,
              postal_code: this.data.postal_code,
              address: this.data.address,
            });
            this.selected_country = this.data.country == null ? 'Colombia' : this.data.country.name;
            // this.getStates(this.data.state.country.id);
            this.private = this.data.private;
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

  editTrue() {
    this.edit = true;
  }

  editFalse() {
    this.edit = false;
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
          this.showErrorNotification();
        },
        () => {
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

        },
        () => {
          this.isDataAvailable = true;
        }
      );
  }

  privateTrue() {
    this.loading$.next(true);
    return this.userServices.changeVisibility()
      .subscribe(
        response => {
          if (response.success) {
            this.private = 1;
            this.showSuccessNotification();
          }
        },
        error => {
          this.loading$.next(false);
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
          this.loading$.next(false);
        }
      );
  }

  privateFalse() {
    this.loading$.next(true);
    return this.userServices.changeVisibility()
      .subscribe(
        response => {
          if (response.success) {
            this.private = 0;
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
          this.loading$.next(false);
        },
        () => {
          this.loading$.next(false);
        }
      );
  }

  changePasswordTrue() {
    this.changePassword = true;
  }

  changePasswordFalse() {
    this.changePassword = false;
  }

  changePasswordMethod() {
    this.loading$.next(true);
    this.body = {
      old_password: this.changePasswordForm.value.old_password,
      new_password: this.changePasswordForm.value.new_password,
      confirm_password: this.changePasswordForm.value.confirm_password
    };
    return this.userServices.changePassword(this.body)
      .subscribe(
        response => {
          if (response.success) {
            this.changePassword = false;
            this.profile = true;
            this.edit = false;
            this.addWorks = false;
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
          this.invalidData = true;
          this.loading$.next(false);
        },
        () => {
          this.loading$.next(false);
        }
      );
  }

  productImages(event) {
    this.files.push(event.file);
  }

  avatarImage(event) {
    this.avatar = event.target.files;
    this.avatar[0];
  }

  addWorksTrue() {
    this.addWorks = true;
  }

  addWorksFalse() {
    this.addWorks = false;
  }

  profileTrue() {
    this.profile = true;
  }

  profileFalse() {
    this.profile = false;
  }

  @ViewChild('childModal') public childModal: ModalDirective;

  public showChildModal(): void {
    this.childModal.show();
  }

  public hideChildModal(): void {
    this.childModal.hide();
  }

  getMyPortfolio() {
    this.loading$.next(true);
    return this.portfolioService.getPortfolio()
      .subscribe(
        response => {
          if (response) {
            this.portfolio = response.portfolios;
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
          this.loading$.next(false);
        },
        () => {
          this.loading$.next(false);
        }
      );
  }

  goToDetail(id) {
    if (!id) {
      this.showErrorNotification();
    }
    location.replace('portfolio/detail/' + id);
  }


  savePortfolio() {
    this.body = {
      name: this.portfolioForm.value.name,
      description: this.portfolioForm.value.description,
    };
    return this.portfolioService.saveWorks(this.body)
      .subscribe(
        response => {
          if (this.files.length > 0) {
            let portfolio_id = response.portfolio;
            for (let i = 0; i < this.files.length; i++) {
              let image = this.files[i];
              let fileHolder: FileHolder = this.files[i];
              this.portfolioService.savePortfolioImage(image, portfolio_id)
                .subscribe(
                  response => {
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
                    this.deleteFile(fileHolder);
                  }
                );
            }
          }
          this.portfolioForm.reset();
          this.getMyPortfolio();
          this.showSuccessNotification();
        },
        error => {
          if (error.status === 401) {
            location.replace('/');
          }
          this.showErrorNotification();
          this.files = [];
        },
        () => {
          this.files = [];
        }
      );
  }

  updatePortfolio() {

  }

  deleteWork(id) {
    return this.portfolioService.deleteWork(id)
      .subscribe(
        response => {
          if (response) {
            this.getMyPortfolio();
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
        }
      );
  }

  updateUser() {
    this.loading$.next(true);
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
    return this.userServices.updateUser(this.body)
      .subscribe(
        response => {
          if (this.avatar !== undefined) {
            if (response.success && this.avatar.length > 0) {
              this.loading$.next(true);
              return this.userServices.saveAvatar(this.avatar[0])
                .subscribe(
                  response => {
                    this.showSuccessNotification();
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
                    this.loading$.next(false);
                  },
                  () => {
                    this.loading$.next(false);
                    location.reload();
                  }
                );
            }
          } else {
            this.showSuccessNotification();
            location.reload();
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
          this.loading$.next(false);
        },
        () => {
          this.loading$.next(false);
        }
      );
  }
}
