import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {PaymentService} from '../payment.service';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';

@Pipe({name: 'transactionPilpe'})
export class TransactionPipe implements PipeTransform {
  transform(value: number, args: string[]): any {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
  providers: [PaymentService]
})
export class TransactionsComponent implements OnInit {

  public rowsOnPage = 10;
  public sortBy = 'buy_number';
  public sortOrder = 'desc';
  public data: any;

  constructor(public paymentServices: PaymentService, public router: Router, private _service: NotificationsService) { }

  ngOnInit() {
    this.getTransactions();
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

  getTransactions() {
    return this.paymentServices.getOrders()
      .subscribe(
        response => {
          if (response) {
            this.data = response.orders;
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

  goToDetail(id) {
    location.replace('transaction/detail/' + id);
  }
}
