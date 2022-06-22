import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CheckoutService {
    url = environment.apiUrl;

    constructor(private httpClient: HttpClient) { }


    get() {
        return this.httpClient.get(this.url +
            "/checkout/get")
    }
    post(data: any) {
        return this.httpClient.post(this.url +
            "/checkout/post", data)
    }

    addOrder(data: any){
        return this.httpClient.post(this.url +
            "/checkout/addOrder", data)
    }

    remove(){
        return this.httpClient.delete(this.url +
            "/checkout/remove")
    }

    removeAllCart(){
        return this.httpClient.delete(this.url +
            "/checkout/deleteAll")
    }

    updateCheckoutId(data: any) {
        return this.httpClient.patch(this.url +
            "/checkout/addCheckoutId", data)
    }
}
