import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
    url = environment.apiUrl;


  constructor(private httpClient: HttpClient) { }

  get() {
    return this.httpClient.get(this.url +
        "/order/get/")
}
// getSum(){
//     return this.httpClient.get(this.url + 
//         "/order/getTotal/");
// }
}
