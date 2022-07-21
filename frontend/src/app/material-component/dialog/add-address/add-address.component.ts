import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
})
export class AddAddressComponent implements OnInit {
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  addressForm: any = FormGroup;
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;
  idUser: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<AddAddressComponent>,
    private snackbarService: SnackbarService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.newForm();
  }

  newForm(): void {
    this.addressForm = this.formBuilder.group({
      address: ['', Validators.compose([Validators.required])],
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.addressForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  //   userId() {

  //     return this.idUser;
  //   }

  add() {
    this.userService.checkToken().subscribe((response: any) => {
      this.idUser = response.id;

      var formData = this.addressForm.value;
      var data = {
        address: formData.address,
        userId: this.idUser,
      };
      console.log(data);

      this.userService.addAddress(data).subscribe(
        (response: any) => {
          this.dialogRef.close();
          this.onAddProduct.emit();
          this.responseMessage = response.message;
          this.snackbarService.openSnackBar(this.responseMessage, 'success');
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
    });
  }

  edit() {
    var formData = this.addressForm.value;
    var data = {
      id: this.dialogData.data.id,
      address: formData.address,
    };
    this.userService.updateAddress(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onEditProduct.emit();
        this.responseMessage = response.message;
        this.snackbarService.openSnackBar(this.responseMessage, 'success');
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
}
