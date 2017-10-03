import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class LocationsService {

  public baseURI = 'http://api.buildoor.co/api/';
  private body: any;
  // auth_token: string;
  // headers: Headers = new Headers();

  constructor(public http: Http) { }

  getCountries() {
    return this.http.get(this.baseURI + 'countries')
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getStates(id) {
    return this.http.get(this.baseURI + 'country/' + id + '/states')
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error || 'server error');
  }
}
