import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
    url = environment.apiUrl;

    constructor(private httpClient: HttpClient) { }
  get(receipt: any) {
    return this.httpClient.get(this.url +
        "/tracking/get/"+ receipt)
}
}
