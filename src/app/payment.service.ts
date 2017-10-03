import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class PaymentService {

  public baseURI = 'http://api.buildoor.co/api/';
  private body: any;
  auth_token: string;
  headers: Headers = new Headers();

  constructor(public http: Http) {
    this.auth_token = (localStorage.getItem('auth_token'));
    this.headers.append('Accept', 'application/json');
    this.headers.append('authorization', 'Bearer ' + this.auth_token);
  }

  paymentService(body) {
    return this.http.post(this.baseURI + 'place-order', body, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getOrders() {
    return this.http.get(this.baseURI + 'orders', {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getTransactionDetail(id) {
    return this.http.get(this.baseURI + 'orders/' + id, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error || 'server error');
  }

}
