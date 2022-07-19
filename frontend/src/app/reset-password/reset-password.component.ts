import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPassForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.resetPassForm = this.formBuilder.group({
      reset_token: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  handleSubmit() {
    var formData = this.resetPassForm.value;
    var data = {
      reset_token: formData.reset_token,
      password: formData.password,
    };
    this.userService.resetPassword(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.router.navigate(['/']);
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, 'succes');
      },
      (error) => {
        console.log(error);
        this.ngxService.stop();
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
}
