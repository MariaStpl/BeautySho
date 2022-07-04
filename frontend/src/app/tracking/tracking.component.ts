import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { SnackbarService } from '../services/snackbar.service';
import { TrackingService } from '../services/tracking.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
    selector: 'app-tracking',
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {
    public track: any;
    responseMessage: any;
    public counts = ["Waiting Confirmation","Order On Process","Package On Delivery",
    "Package Delivered"];
    public orderStatus:any;

    constructor(private trackingService: TrackingService,
        private ngxService: NgxUiLoaderService,
        private snackbarService: SnackbarService,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            console.log(params) //log the entire params object
            console.log(params['receipt'])
            this.viewTracking(params.receipt)
        }) 
        
    }

    viewTracking(receipt:any) {
        this.trackingService.get(receipt).subscribe((res: any) => {
            this.track = res.map((data: any) => {
                console.log(data.status);
                this.orderStatus = data.status            
                return data
            })
        }, (error: any) => {
            this.ngxService.stop();
            if (error.error?.message) {
                this.responseMessage = error.error?.message;
            }
            else {
                this.responseMessage = GlobalConstants.genericError;
            }
            this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
        }
        )

    }
}