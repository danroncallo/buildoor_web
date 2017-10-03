import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../users.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public logged: boolean;

  constructor(public formBuilder: FormBuilder,
              public usersService: UsersService,
              public router: Router) { }

  ngOnInit() {
    this.IsLogged();
  }

  IsLogged() {
    if (localStorage.length > 0) {
      this.logged = true;
    }
    if (localStorage.length === 0) {
      this.logged = false;
      location.replace('login');
    }
  }

}
