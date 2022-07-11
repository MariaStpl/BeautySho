import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { ChangePasswordComponent } from '../material-component/dialog/change-password/change-password.component';
import { ConfirmationComponent } from '../material-component/dialog/confirmation/confirmation.component';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { SignupComponent } from '../signup/signup.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    }

