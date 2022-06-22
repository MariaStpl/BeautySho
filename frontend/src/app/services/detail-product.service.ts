import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetailProductService {
    url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  addProductsDetails(data: any) {
    return this.httpClient.post(this.url +
        "/detail/addProductsDetails", data)
}

getProductsDetails() {
    return this.httpClient.get(this.url + 
        "/detail/getProductsDetails")
}

getProductsItem(id: any) {
    return this.httpClient.get(this.url + 
        "/detail/getProductsItem/" + id)
}

updateStatus(data: any) {
    return this.httpClient.patch(this.url +
        "/detail/updateStatus", data, {
        headers: new HttpHeaders().set('Content-Type', "application/json")
    })
}

update(data: any) {
    return this.httpClient.put(this.url +
        "/detail/update", data)
}
delete(id: any) {
    return this.httpClient.delete(this.url +
        "/detail/delete/" + id, {
        headers: new HttpHeaders().set('Content-Type', "application/json")
    })
}

getProducts() {
    return this.httpClient.get(this.url +
        "/product/get/")
}
getItemsByProduct(id: any) {
    return this.httpClient.get(this.url + "/detail/getByProduct/" + id);
}

getById(id: any) {
    return this.httpClient.get(this.url + "/detail/getById/" + id);
}



}
