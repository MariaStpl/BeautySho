import { HttpParams } from '@angular/common/http';
import { partitionArray } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { ChangePasswordComponent } from '../material-component/dialog/change-password/change-password.component';
import { ConfirmationComponent } from '../material-component/dialog/confirmation/confirmation.component';
import { CartService } from '../services/cart.service';
import { ProfilService } from '../services/profil.service';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-header-home',
  templateUrl: './header-home.component.html',
  styleUrls: ['./header-home.component.scss'],
})
export class HeaderHomeComponent implements OnInit {
  public totalItem: number = 0;
  public hasil: any;
  public profilId: any;
  public responseMessage: any;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private cartService: CartService,
    private ngxService: NgxUiLoaderService,
    private profilService: ProfilService,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.token();
    this.cartService.getCart().subscribe((response: any) => {
      this.totalItem = response.length;
    });
  }

  profilView() {
    this.userService.checkToken().subscribe(
      (response: any) => {
        this.router.navigate(['/profil/get/' + response.id]);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  token() {
    if (localStorage.getItem('token') != null) {
      this.userService.checkToken().subscribe(
        (response: any) => {
          this.hasil = response;
          this.profilId = response.id;
          console.log(this.hasil);
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  signupAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(SignupComponent, dialogConfig);
  }
  forgotPasswordAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(ForgotPasswordComponent, dialogConfig);
  }
  loginAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(LoginComponent, dialogConfig);
    this.token();
  }

  cartAction() {
    this.router.navigate(['/cart']);
  }

  shipAction() {
    this.router.navigate(['/order/getAll']);
  }
  logout() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Logout',
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (user) => {
        dialogRef.close();
        localStorage.clear();
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
        this.token();
      }
    );
  }
  changePassword() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }
}
