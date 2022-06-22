import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    url = environment.apiUrl;

    constructor(private httpClient: HttpClient) { }

    add(data: any) {
        return this.httpClient.post(this.url +
            "/product/add", data)
    }


    update(data: any) {
        return this.httpClient.put(this.url +
            "/product/update", data)
    }

    getProducts() {
        return this.httpClient.get(this.url +
            "/product/get/")
    }

    getProductsHome() {
        return this.httpClient.get(this.url + 
            "/product/getProductsHome")
    }

    
    updateStatus(data: any) {
        return this.httpClient.patch(this.url +
            "/product/updateStatus", data, {
            headers: new HttpHeaders().set('Content-Type', "application/json")
        })
    }

    delete(id: any) {
        return this.httpClient.delete(this.url +
            "/product/delete/" + id, {
            headers: new HttpHeaders().set('Content-Type', "application/json")
        })
    }

    getProductsByCategory(id: any) {
        return this.httpClient.get(this.url + "/product/getByCategory/" + id);
    }

    getById(id: any) {
        return this.httpClient.get(this.url + "/product/getById/" + id);
    }

}
