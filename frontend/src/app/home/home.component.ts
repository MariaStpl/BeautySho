import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { SignupComponent } from '../signup/signup.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public totalItem: number = 0;

    constructor(private dialog: MatDialog,
        private router: Router,
        private userService: UserService,
        private cartService:CartService) { }

    ngOnInit(): void {
        if (localStorage.getItem('token') != null) {
            this.userService.checkToken().subscribe((response: any) => {
                this.router.navigate(['/beautyshop/dashboard']);
            }, (error: any) => {
                console.log(error);
            })
        }
        this.cartService.getCart().subscribe((response: any) => {
            this.totalItem = response.length;
            
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

    shipAction() {
        this.router.navigate(['/order/getAll'])
    }
}

