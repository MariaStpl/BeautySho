import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
    url = environment.apiUrl;

    constructor(private httpClient: HttpClient) { }

    get() {
        return this.httpClient.get(this.url +
            "/notification/get")
    }
  
}
