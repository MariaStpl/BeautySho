import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}

  signup(data: any) {
    return this.httpClient.post(this.url + '/user/signup', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  signupAdmin(data: any) {
    return this.httpClient.post(this.url + '/user/signupAdmin', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  forgotPassword(data: any) {
    return this.httpClient.post(this.url + '/user/forgotPassword/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  resetPassword(data: any) {
    return this.httpClient.patch(this.url + '/user/resetPassword', data);
  }

  login(data: any) {
    return this.httpClient.post(this.url + '/user/login/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  checkToken() {
    return this.httpClient.get(this.url + '/user/checkToken');
  }

  changePassword(data: any) {
    return this.httpClient.post(this.url + '/user/changePassword', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  getUsers() {
    return this.httpClient.get(this.url + '/user/get/');
  }

  update(data: any) {
    return this.httpClient.patch(this.url + '/user/update', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  editProfil(data: any) {
    return this.httpClient.put(this.url + '/profil/editProfil', data);
  }

  getAddressByUser(userID: any) {
    return this.httpClient.get(this.url + '/user/getByUser/' + userID);
  }

  addAddress(data: any) {
    return this.httpClient.post(this.url + '/user/addAddress', data);
  }

  updateAddress(data: any) {
    return this.httpClient.put(this.url + '/user/updateAddress', data);
  }
}
