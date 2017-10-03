import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class UsersService {

  public baseURI = 'http://api.buildoor.co/api/';
  private body: any;
  auth_token: string;
  headers: Headers = new Headers();

  constructor(public http: Http) {
    this.auth_token = (localStorage.getItem('auth_token'));
    this.headers.append('Accept', 'application/json');
    this.headers.append('authorization', 'Bearer ' + this.auth_token);
  }

  saveUsers(body) {
    return this.http.post(this.baseURI + 'users', body)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  updateUser(body) {
    return this.http.put(this.baseURI + 'users', body, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  saveAvatar(image) {
    console.log('going to save...');
    const file: File = image;
    const formData: FormData = new FormData();
    formData.append('image', file);

    return this.http.post(this.baseURI + 'users/avatar', formData, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getUserByToken() {
    return this.http.get(this.baseURI + 'users/token', {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  changePassword(body) {
    return this.http.put(this.baseURI + 'users/change/password', body, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  changeVisibility() {
    return this.http.put(this.baseURI + 'users/change/visibility', null, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  registerSocialUser(body) {
    return this.http.post(this.baseURI + 'users/social', body)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getAdminByToken() {
    return this.http.get(this.baseURI + 'admin/profile', {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error || 'server error');
  }

}
