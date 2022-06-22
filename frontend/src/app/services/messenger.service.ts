import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
    subject = new Subject()

  constructor() { }

  sendMsg(singleProduct:any) {
    this.subject.next(singleProduct) //Triggering an event
  }

  getMsg() {
    return this.subject.asObservable()
  }
}
