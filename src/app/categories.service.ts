import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class CategoriesService {

  public baseURI = 'http://api.buildoor.co/api/';
  private body: any;
  auth_token: string;
  headers: Headers = new Headers();

  constructor(public http: Http) {
    this.auth_token = (localStorage.getItem('auth_token'));
    this.headers.append('Accept', 'application/json');
    this.headers.append('authorization', 'Bearer ' + this.auth_token);
  }

  getCategories() {
    return this.http.get(this.baseURI + 'admin/categories', {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getCategoriesStore() {
    return this.http.get(this.baseURI + 'categories')
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getCategory(id) {
    return this.http.get(this.baseURI + 'admin/categories/' + id, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  deleteCategory(id) {
    return this.http.delete(this.baseURI + 'admin/categories/' + id, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  saveCategory(body) {
    return this.http.post(this.baseURI + 'admin/categories', body, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  updateCategory(id, body) {
    return this.http.put(this.baseURI + 'admin/categories/' + id, body, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  filterByCategory(id) {
    return this.http.get(this.baseURI + 'category/' + id + '/products')
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error || 'server error');
  }
}
