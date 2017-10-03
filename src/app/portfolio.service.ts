import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class PortfolioService {

  public baseURI = 'http://api.buildoor.co/api/';
  private body: any;
  auth_token: string;
  headers: Headers = new Headers();

  constructor(public http: Http) {
    this.auth_token = (localStorage.getItem('auth_token'));
    this.headers.append('Accept', 'application/json');
    this.headers.append('authorization', 'Bearer ' + this.auth_token);
  }

  getPortfolio() {
    return this.http.get(this.baseURI + 'portfolios', {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getWork(id) {
    return this.http.get(this.baseURI + 'portfolios/' + id, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  saveWorks(body) {
    return this.http.post(this.baseURI + 'portfolios', body, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  deleteWork(id) {
    return this.http.delete(this.baseURI + 'portfolios/' + id, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  savePortfolioImage (image, id) {
    console.log('going to save...');
    const file: File = image;
    const formData: FormData = new FormData();
    formData.append('image', file);

    return this.http.post(this.baseURI + 'portfolio/' + id + '/images', formData, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error || 'server error');
  }

}
