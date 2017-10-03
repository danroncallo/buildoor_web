import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class LoginService {

  public baseURI = 'http://api.buildoor.co/';
  private body: any;
  // auth_token: string;
  // headers: Headers = new Headers();

  constructor(public http: Http) {
  }

  login(body) {
    console.log(body);
    return this.http.post(this.baseURI + 'oauth/token', body)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  loginAdmin(body) {
    console.log(body);
    return this.http.post(this.baseURI + 'api/admin/login', body)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getTwitterAuth() {
    return this.http.get(this.baseURI + 'api/auth/twitter')
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getFacebookAuth() {
    return this.http.get(this.baseURI + 'api/auth/facebook')
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error || 'server error');
  }
}
