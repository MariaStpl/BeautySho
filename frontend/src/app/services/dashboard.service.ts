import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    url = environment.apiUrl;

  constructor(private httpClient:HttpClient) { }

  getDetails(){
      return this.httpClient.get(this.url +
         "/dashboard/details/");
  }

  getOrders() {
    return this.httpClient.get(this.url +
        "/dashboard/get/")
}

topProduct() {
    return this.httpClient.get(this.url +
        "/dashboard/topProduct/")
}

topItem() {
    return this.httpClient.get(this.url +
        "/dashboard/topItem/")
}
}
