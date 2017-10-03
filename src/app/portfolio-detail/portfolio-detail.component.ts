import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PortfolioService} from '../portfolio.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.css'],
  providers: [PortfolioService]
})
export class PortfolioDetailComponent implements OnInit {

  id: number;
  sub: any;
  public data: any;
  public body: any;
  public isDataAvailable: boolean = false;

  constructor(private route: ActivatedRoute,
              public portfolioServices: PortfolioService, private _service: NotificationsService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.getWork(this.id);
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

  getWork(id) {
    return this.portfolioServices.getWork(id)
      .subscribe(
        response => {
          if (response) {
            this.data = response.work;
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
        () => { this.isDataAvailable = true; }
      );
  }
}
