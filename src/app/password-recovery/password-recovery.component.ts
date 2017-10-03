import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {LoginService} from '../login.service';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css'],
  providers: [LoginService]
})
export class PasswordRecoveryComponent implements OnInit {

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

  public passwordForm = this.formBuilder.group({
    password: ['', Validators.required],
    confirm_password: ['', Validators.required],
  });

  constructor(public formBuilder: FormBuilder,
              public router: Router) { }

  ngOnInit() {
  }
}
