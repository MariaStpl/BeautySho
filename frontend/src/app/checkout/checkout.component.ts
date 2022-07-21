import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { AddAddressComponent } from '../material-component/dialog/add-address/add-address.component';
import { CartService } from '../services/cart.service';
import { CheckoutService } from '../services/checkout.service';
import { NotificationService } from '../services/notification.service';
import { ProfilService } from '../services/profil.service';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  public cartItem: any;
  public detailCustomers: any;
  manageOrderForm: any = FormGroup;
  responseMessage: any;
  checkoutId: any;
  userID: any;
  public cartList: any;
  data: any;
  public list: any;
  addressdata: any = [];

  constructor(
    private checkoutService: CheckoutService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router,
    private cartService: CartService,
    private route: ActivatedRoute,
    private userService: UserService,
    private profilService: ProfilService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.viewCart();
    this.getAddress();
    this.manageOrderForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
      contactNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(GlobalConstants.contactNumberRegex),
        ],
      ],
      paymentMethod: [null, [Validators.required]],
      address: [null, [Validators.required]],
      shipping_option: [null, [Validators.required]],
    });
    this.getSumVal();
  }

  getAddress() {
    this.userService.checkToken().subscribe(
      (response: any) => {
        this.userID = response.id;
        this.userService
          .getAddressByUser(this.userID)
          .subscribe((response: any) => {
            this.addressdata = response;
          });
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(AddAddressComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddProduct.subscribe(
      (response) => {
        this.getAddress();
      }
    );
  }

  validateSubmit() {
    if (
      this.manageOrderForm.controls['name'].value === null ||
      this.manageOrderForm.controls['email'].value === null ||
      this.manageOrderForm.controls['address'].value === null ||
      this.manageOrderForm.controls['shipping_option'].value === null ||
      this.manageOrderForm.controls['contactNumber'].value === null ||
      this.manageOrderForm.controls['paymentMethod'].value === null ||
      !this.manageOrderForm.controls['contactNumber'].valid ||
      !this.manageOrderForm.controls['email'].valid
    )
      return true;
    else return false;
  }
  navigate(id: any) {}

  submitAction() {
    this.ngxService.start();
    var formData = this.manageOrderForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      address: formData.address,
      shipping_option: formData.shipping_option,
    };

    this.checkoutService.post(data).subscribe(
      (response: any) => {
        console.log(response);
        this.router.navigate(['/order/get/' + response.insertId]);

        this.ngxService.stop();
        this.checkoutService.removeAllCart().subscribe((response: any) => {
          this.cartItem();
        });
      },
      (error: any) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
      }
    );
  }
  viewCart() {
    this.checkoutService.get().subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.cartItem = response.map((data: any) => {
          if (data.itemImage) {
            data.itemImage =
              environment.apiUrl + '/images/upload_detail/' + data.itemImage;
            return data;
          }
          return data;
        });
      },
      (error: any) => {
        this.ngxService.stop();
        console.log(error);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
      }
    );
  }

  getSumVal() {
    this.cartService.getSum().subscribe((response: any) => {
      this.ngxService.stop();
      this.data = response;
      console.log(this.data.sumVal);
    });
  }

  cart() {
    this.router.navigate(['/cart']);
  }
}
