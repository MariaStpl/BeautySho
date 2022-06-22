import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    url = environment.apiUrl;
    public cartItemList : any =[]

    constructor(private httpClient: HttpClient) { }

    addProductToCart(data: any) {
        return this.httpClient.post(this.url +
            "/cart/add", data)
    }

    getSum(){
        return this.httpClient.get(this.url + 
            "/cart/getTotal/");
    }
    getCart() {
        return this.httpClient.get(this.url +
            "/cart/get/")
    }

    delete(id: any) {
        return this.httpClient.delete(this.url +
            "/cart/delete/" + id)
    }

    setCartData(data:any){
        return this.httpClient.patch(this.url +
            "/cart/update", data)

    }

    removeAllCart(){
        return this.httpClient.delete(this.url +
            "/cart/deleteAll")
    }
}
