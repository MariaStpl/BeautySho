import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-fogot-password-cms',
  templateUrl: './fogot-password-cms.component.html',
  styleUrls: ['./fogot-password-cms.component.scss']
})
export class FogotPasswordCmsComponent implements OnInit {
    forgotPasswordForm:any = FormGroup;
    responseMessage : any;

  constructor(private formBuilder:FormBuilder,
    private userService:UserService,
    private ngxService:NgxUiLoaderService,
    private snackbarService:SnackbarService,
    private router:Router) { }

  ngOnInit(): void {
      this.forgotPasswordForm = this.formBuilder.group({
          email: [null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]]
      });
  }

  handleSubmit(){
      this.ngxService.start();
      var formData = this.forgotPasswordForm.value;
      var data ={
          email: formData.email
      }
      this.userService.forgotPassword(data).subscribe((response:any)=>{
          this.ngxService.stop();
          this.responseMessage = response?.message;
          this.router.navigate(['/administrator']);
          this.snackbarService.openSnackBar(this.responseMessage,"");
      },(error)=>{
          this.ngxService.stop();
          if(error.error?.message){
              this.responseMessage = error.error?.message;
          }
          else{
              this.responseMessage = GlobalConstants.genericError;
          }
          this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

}
