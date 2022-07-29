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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
    public orderList: any = [];
    public orderitems: any = [];
    responseMessage: any;
    public items: any = [];
    itemArray: any = [];
    data: any;
    manageOrderForm: any = FormGroup;
    hasil: any;

    constructor(private orderService: OrderService,
        private ngxService: NgxUiLoaderService,
        private snackbarService: SnackbarService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private userService: UserService) { }

    ngOnInit(): void {
        this.ngxService.start();
        this.route.params.subscribe(params => {
            console.log(params) //log the entire params object
            console.log(params['id'])
            this.cartItem(params.id)
        })

        this.manageOrderForm = this.formBuilder.group({
            receipt: [null, [Validators.required]]
        })
    }

    trackingOrder(receipt: any) {
        this.router.navigate(['/tracking/get/' + receipt]);
        this.ngxService.start();
    }

    token() {
        if (localStorage.getItem('token') != null) {
            this.userService.checkToken().subscribe(
                (response: any) => {
                    this.hasil = response;
                    console.log(this.hasil);
                },
                (error: any) => {
                    console.log(error);
                }
            );
        }
    }

    tracking() {
        var formData = this.manageOrderForm.value;
        var data = {
            receipt: formData.receipt,
        }
        this.router.navigate(['/tracking/get/' + data.receipt])
    }

    cartItem(id: any) {
        this.orderService.get(id).subscribe((response: any) => {
            this.ngxService.stop();
            this.orderList = response.map((data: any) => {
                data.items.map((data: any) => {
                    if (data.itemImage) {
                        data.itemImage = environment.apiUrl + '/images/upload_detail/' + data.itemImage;
                        return data;
                    }
                    return data
                })
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
