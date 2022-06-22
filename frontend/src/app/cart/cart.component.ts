import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { CartService } from '../services/cart.service';
import { SignupComponent } from '../signup/signup.component';
import { environment } from 'src/environments/environment';
import { ConfirmationComponent } from '../material-component/dialog/confirmation/confirmation.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import { MatTableDataSource } from '@angular/material/table';
import { BillService } from '../services/bill.service';
import { CheckoutService } from '../services/checkout.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
    displayedColumns: string[] = ['no','productName','itemImage','itemDesc','itemSize','itemPrice','quantity', 'subtotal','action'];
    public cartList: any;
    url = environment.apiUrl;
    dataSource: any;
    data:any;
    cartContents:any;
    responseMessage: any;
    onEditCart = new EventEmitter();
    i = 1;
    quantity: number = 1
    updateDate:any;
    
    constructor(private dialog: MatDialog,
        private cartService: CartService,
        private ngxService: NgxUiLoaderService,
        private snackbarService: SnackbarService,
        private billService:BillService,
        private checkoutService:CheckoutService,
        private router:Router) { }

    ngOnInit(): void {
        this.ngxService.start
        this.cartItem()
        this.getSumVal()

    }

    cartItem() {
        this.cartService.getCart().subscribe((response: any) => {
            this.cartList = response.map((data: any) => {
            
                if (data.itemImage){
                    data.itemImage = environment.apiUrl + '/images/upload_detail/' + data.itemImage;
                    return data;
                }
                return data
            })
            this.cartContents = this.cartList[0];
            this.ngxService.stop();
            this.dataSource = new MatTableDataSource(response)
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
        

    }

    emptyCart(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            message: 'delete all product'
        };

        const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
        const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
            this.ngxService.start();
            this.deleteAllProduct();
            dialogRef.close();
        })
    }

    deleteAllProduct(){
        this.cartService.removeAllCart().subscribe((response: any) => {
            this.ngxService.stop();
            this.cartItem();
            this.responseMessage = response?.message;
            this.snackbarService.openSnackBar(GlobalConstants.productDeleted, "success");
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
    }

    handleDeleteAction(values: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            message: 'delete ' + values.productName + values.itemSize
        };

        const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
        const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
            this.ngxService.start();
            this.deleteProduct(values.id);
            dialogRef.close();
        })
    }
    deleteProduct(id: any) {
        this.cartService.delete(id).subscribe((response: any) => {
            this.ngxService.stop();
            this.cartItem();
            this.responseMessage = response?.message;
            this.snackbarService.openSnackBar(this.responseMessage, "success");
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
    }

    validateInput(event: any, i: number) {
        const quantity = +event.target.value;
        if (quantity < 1) {
            event.target.value = this.cartList[i].quantity;
            return
        }
        this.qtyUpdated(quantity, i)
    }

    private qtyUpdated(quantity: number, id: any) {
        var data ={
            quantity:quantity.toString(),
            id:id
        }
        this.cartService.setCartData(data).subscribe((response:any)=>{
            this.ngOnInit();
            this.ngxService.stop();
        }, (error:any)=>{
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

    }
    // private qtyUpdated(quantity: number, i: number) {
    //     this.cartList[i].quantity = quantity;
    //     this.cartService.setCartData(this.cartList);
    // }

    getSumVal(){
        this.cartService.getSum().subscribe((response:any)=>{
            this.ngxService.stop();
            this.data = response;
            console.log(this.data.sumVal);
        })
        
        
    }

    checkoutCart(){
        this.router.navigate(['/checkout/get'])
        
        this.ngOnInit()
        //this.router.navigateByUrl(`/detail/getProductsItem/${id}`)
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
    shipAction() {
        this.router.navigate(['/order'])
    }

}
