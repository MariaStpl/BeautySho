import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfilComponent } from '../profil/profil.component';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.component.html',
  styleUrls: ['./edit-profil.component.scss'],
})
export class EditProfilComponent implements OnInit {
  onEditProduct = new EventEmitter();
  profilForm: any = FormGroup;
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;
  uploaded_image:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProfilComponent>,
    private snackbarService: SnackbarService,
    private userService: UserService
  ) {}

  getFile(event:any){
    this.uploaded_image = event.target.files[0];
    console.log("uploaded_image", this.uploaded_image)
}


  ngOnInit(): void {
    this.profilForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [{ value: null, disabled: true }, Validators.required],
      contactNumber: [null, Validators.required],
      role: [{ value: null, disabled: true }, Validators.required],
      profil_image: ['', Validators.compose([Validators.required])]
    });

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.profilForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
    }
  }

  edit():void {
    let formData = new FormData;
        formData.append("id", this.dialogData.data.id);
        formData.set("name", this.profilForm.controls.name.value);
        formData.set("contactNumber", this.profilForm.controls.contactNumber.value);
        formData.set("uploaded_image", this.uploaded_image);
    this.userService.editProfil(formData).subscribe(
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
