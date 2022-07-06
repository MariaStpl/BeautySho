import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { CartService } from '../services/cart.service';
import { SnackbarService } from '../services/snackbar.service';
import { TrackingService } from '../services/tracking.service';
import { GlobalConstants } from '../shared/global-constants';
import { SignupComponent } from '../signup/signup.component';

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
    public totalItem: number = 0;

    constructor(private trackingService: TrackingService,
        private ngxService: NgxUiLoaderService,
        private snackbarService: SnackbarService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private cartService:CartService) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            console.log(params) //log the entire params object
            console.log(params['receipt'])
            this.viewTracking(params.receipt)
        }) 
        this.cartService.getCart().subscribe((response: any) => {
            this.totalItem = response.length;
        })
        
    }

    viewTracking(receipt:any) {
        this.trackingService.get(receipt).subscribe((res: any) => {
            this.track = res.map((data: any) => {
                this.orderStatus = data.status   
                data.items.map((data: any) => {
                    if (data.itemImage) {
                        data.itemImage = environment.apiUrl + '/images/upload_detail/' + data.itemImage;
                        return data;
                    }
                    return data
                }) 
                data.hist.map((data: any) => {
                    return data
                })          
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
    signupAction() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "550px";
        this.dialog.open(SignupComponent, dialogConfig);
    }
    forgotPasswordAction() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "550px";
        this.dialog.open(ForgotPasswordComponent, dialogConfig);
    }
    loginAction() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "550px";
        this.dialog.open(LoginComponent, dialogConfig);
    }

    cartAction() {
        this.router.navigate(['/cart'])
    }

    shipAction() {
        this.router.navigate(['/order/getAll'])
    }

    cart() {
        this.router.navigate(['/cart'])
}
}