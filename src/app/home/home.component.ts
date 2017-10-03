import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {ContactService} from '../contact.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ContactService]
})
export class HomeComponent implements OnInit {

  public body: any;

  constructor(public formBuilder: FormBuilder,
              public router: Router,
              private _service: NotificationsService,
              public contactService: ContactService) {
  }

  ngOnInit() {
  }

  public contactForm = this.formBuilder.group({
    name: [''],
    email: [''],
    message: ['']
  });

  sendMessage() {
    this.body = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      message: this.contactForm.value.message,
    };

    this.contactService.sendMessage(this.body)
      .subscribe(
        response => {
          if (response) {
            this.contactForm.reset();
            this.showSuccessNotification();
            // location.replace('/');
          }
        },
        error => {
          this.showErrorNotification();
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
