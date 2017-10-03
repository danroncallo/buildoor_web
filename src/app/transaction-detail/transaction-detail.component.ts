import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {PaymentService} from '../payment.service';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';

@Pipe({name: 'detailPipe'})
export class DetailPipe implements PipeTransform {
  transform(value: number, args: string[]): any {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css'],
  providers: [PaymentService]
})
export class TransactionDetailComponent implements OnInit {

  public rowsOnPage = 10;
  public sortBy = 'product';
  public sortOrder = 'desc';
  public data: any;
  public id: any;
  public sub: any;

  constructor(public paymentServices: PaymentService, private route: ActivatedRoute, private router: Router, private _service: NotificationsService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.getTransactionDetail(this.id);
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

  getTransactionDetail(id) {
    return this.paymentServices.getTransactionDetail(id)
      .subscribe(
        response => {
          if (response) {
            this.data = response.details;
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
}
