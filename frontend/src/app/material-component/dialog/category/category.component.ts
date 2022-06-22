import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    isPhotoError = false;
    submitted: boolean = false;
    uploadError: string = '';
    onAddCategory = new EventEmitter();
    onEditCategory = new EventEmitter();
    categoryForm:any = FormGroup;
    dialogAction:any = "Add";
    action:any = "Add";
    responseMessage:any;
    icon: any;
    uploaded_icon:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private categoryService:CategoryService,
  public dialogRef:MatDialogRef<CategoryComponent>,
  private snackbarService:SnackbarService
  ) { }

  getFile(event:any){
    this.uploaded_icon = event.target.files[0];
    console.log("uploaded_icon", this.uploaded_icon)
}

  ngOnInit(){
      this.newForm()
  }

  newForm(): void {
        this.categoryForm = this.formBuilder.group({
            icon: ['', Validators.compose([Validators.required])],
            name: ['', [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
        })
        if (this.dialogData.action === 'Edit') {
            this.dialogAction = "Edit";
            this.action = "Update";
            this.categoryForm.patchValue(this.dialogData.data);
        }
    }

  handleSubmit(){
      if(this.dialogAction === "Edit"){
          this.edit()
      }
      else{
          this.add()
      }
  }

  add():void {
    let formData = new FormData;
    formData.set("name", this.categoryForm.controls.name.value);
    formData.set("uploaded_icon", this.uploaded_icon);
    
    this.categoryService.add(formData).subscribe((response: any) => {
        this.dialogRef.close();
        this.onAddCategory.emit();
        this.responseMessage = response.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
        if (error.error?.message) {
            this.responseMessage = error.error?.message;
        }
        else {
            this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
}
edit():void{
    let formData = new FormData;
    formData.append("id", this.dialogData.data.id);
    formData.set("name", this.categoryForm.controls.name.value);
    formData.set("uploaded_icon", this.uploaded_icon);
    
    this.categoryService.update(formData).subscribe((response: any) => {
        this.dialogRef.close();
        this.onEditCategory.emit();
        this.responseMessage = response.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
        if (error.error?.message) {
            this.responseMessage = error.error?.message;
        }
        else {
            this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
}}
    // var formData = this.categoryForm.value;
    // var data = {
    //     id:this.dialogData.data.id,
    //     name: formData.name
    // }
    // this.categoryService.update(data).subscribe((response:any)=>{
    //     this.dialogRef.close();
    //     this.onEditCategory.emit();
    //     this.responseMessage = response.message;
    //     this.snackbarService.openSnackBar(this.responseMessage, "success");
    // }, (error:any)=>{
    //     this.dialogRef.close();
    //     if(error.error?.message){
    //         this.responseMessage = error.error?.message;
    //     }
    //     else{
    //         this.responseMessage = GlobalConstants.genericError;
    //     }
    //     this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    // })
