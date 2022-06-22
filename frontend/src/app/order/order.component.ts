import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
    public orderList: any;
    responseMessage: any;

  constructor(private orderService:OrderService,
    private ngxService:NgxUiLoaderService,
    private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.cartItem()
  }

  cartItem() {
    this.orderService.get().subscribe((response: any) => {
        this.orderList = response.map((data: any) => {
            if (data.itemImage){
                data.itemImage = environment.apiUrl + '/images/upload_detail/' + data.itemImage;
                return data;
            }
            return data
        })
        this.responseMessage = response.message;
        this.ngxService.stop();
    }, (error: any) => {
        this.ngxService.stop();
        console.log(error);
        if (error.error?.message) {
            this.responseMessage = error.error?.message;
        }
        else {
            this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
    console.log(this.orderList);
    

}

}
