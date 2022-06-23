import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { SnackbarService } from '../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { CartService } from '../services/cart.service';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
    public orderList: any;
    responseMessage: any;
    public items: any = [];
    itemArray: any = [];
    public totalItem: number = 0;
    data:any;

    constructor(private orderService: OrderService,
        private ngxService: NgxUiLoaderService,
        private snackbarService: SnackbarService,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private router: Router,
        private cartService: CartService) { }

    ngOnInit(): void {
        // this.route.params.subscribe(params => {
        //     console.log(params) //log the entire params object
        //     console.log(params['id'])
        //     this.cartItem(params.id)
        // }) 
        this.cartItem()
        this.cartService.getCart().subscribe((response: any) => {
            this.totalItem = response.length;
        })
        this.getSumVal()
    }

    cartItem() {
        this.orderService.get().subscribe((response: any) => {
            this.orderList = response.map((data: any) => {
                if (data.itemImage) {
                    data.itemImage = environment.apiUrl + '/images/upload_detail/' + data.itemImage;
                    return data;
                }
                return data
            })
            console.log(this.orderList);

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
    getSumVal(){
        this.orderService.getSum().subscribe((response:any)=>{
            this.ngxService.stop();
            this.data = response;
            console.log(this.data.sumVal);
        })
        
        
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

}
