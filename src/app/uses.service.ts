import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class UsesService {

  public baseURI = 'http://api.buildoor.co/api/';
  private body: any;
  auth_token: string;
  headers: Headers = new Headers();

  constructor(public http: Http) {
    this.auth_token = (localStorage.getItem('auth_token'));
    this.headers.append('Accept', 'application/json');
    this.headers.append('authorization', 'Bearer ' + this.auth_token);
  }

  getUses() {
    return this.http.get(this.baseURI + 'admin/uses', {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getUsesStore() {
    return this.http.get(this.baseURI + 'uses')
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  filterByUse(id) {
    return this.http.get(this.baseURI + 'use/' + id + '/products')
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getUse(id) {
    return this.http.get(this.baseURI + 'admin/uses/' + id, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  deleteUse(id) {
    return this.http.delete(this.baseURI + 'admin/uses/' + id, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  saveUse(body) {
    return this.http.post(this.baseURI + 'admin/uses', body, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  updateUse(id, body) {
    return this.http.put(this.baseURI + 'admin/uses/' + id, body, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error || 'server error');
  }
}
