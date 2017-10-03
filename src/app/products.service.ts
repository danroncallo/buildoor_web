import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ProductsService {

  public baseURI = 'http://api.buildoor.co/api/';
  private body: any;
  auth_token: string;
  headers: Headers = new Headers();

  constructor(public http: Http) {
    this.auth_token = (localStorage.getItem('auth_token'));
    this.headers.append('Accept', 'application/json');
    this.headers.append('authorization', 'Bearer ' + this.auth_token);
  }

  getProducts() {
    return this.http.get(this.baseURI + 'admin/products', {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getProductsStore() {
    return this.http.get(this.baseURI + 'products')
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  saveProducts(body) {
    return this.http.post(this.baseURI + 'admin/products', body, {headers: this.headers})
    // return this.http.post('http://localhost:8000/api/products', body)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  saveProductImage(files, id) {
    console.log('going to save all images...');
    let images = [];
    let file: File;
    let formData: FormData = new FormData();

    for (let i = 0; i < files.length; i++) {
      file = files[i];
      formData.append('image'+i, file);
    }
    return this.http.post(this.baseURI + 'admin/product/' + id + '/images', formData, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getProduct(id) {
    return this.http.get(this.baseURI + 'admin/product/' + id + '/categories/uses', {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getProductByIdStore(id) {
    return this.http.get(this.baseURI + 'products/' + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getProductById(id) {
    return this.http.get(this.baseURI + 'admin/products/' + id, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  updateProducts(id, body) {
    return this.http.put(this.baseURI + 'admin/products/' + id, body, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  updateStatus(id) {
    return this.http.put(this.baseURI + 'admin/products/status/' + id, null, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  searchProduct(keyword) {
    return this.http.get(this.baseURI + 'product/search/' + keyword)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  updateQuantity(id, body) {
    return this.http.put(this.baseURI + 'admin/stocks/' + id, body, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  filterByPrice(min, max) {
    return this.http.get(this.baseURI + 'product/search/' + min + '/' + max)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  removeImage(id) {
    return this.http.delete(this.baseURI + 'admin/product/' + id + '/images', {headers: this.headers})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error || 'server error');
  }
}
