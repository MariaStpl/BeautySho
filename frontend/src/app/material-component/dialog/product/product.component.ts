import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { error } from 'console';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})


export class ProductComponent implements OnInit {
    isPhotoError = false;
    submitted: boolean = false;
    uploadError: string = '';
    onAddProduct = new EventEmitter();
    onEditProduct = new EventEmitter();
    productForm: any = FormGroup;
    dialogAction: any = "Add";
    action: any = "Add";
    responseMessage: any;
    categorys: any = [];
    image: any;
    uploaded_image:any;
    

    constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
        private formBuilder: FormBuilder,
        private productService: ProductService,
        public dialogRef: MatDialogRef<ProductComponent>,
        private categoryService: CategoryService,
        private snackbarService: SnackbarService,
        private httpClient: HttpClient
    ) { }

    getFile(event:any){
        this.uploaded_image = event.target.files[0];
        console.log("uploaded_image", this.uploaded_image)
    }


    ngOnInit() {
        this.newForm()
    }

    newForm(): void {
        this.productForm = this.formBuilder.group({
            image: ['', Validators.compose([Validators.required])],
            name: ['', [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
            categoryId: ['', Validators.compose([Validators.required])],
            price: ['', Validators.compose([Validators.required])],
            description: ['', Validators.compose([Validators.required])],
        })
        if (this.dialogData.action === 'Edit') {
            this.dialogAction = "Edit";
            this.action = "Update";
            this.productForm.patchValue(this.dialogData.data);
        }
        this.getCategorys();
    }

    
    getCategorys() {
        this.categoryService.getCategorys().subscribe((response: any) => {
            this.categorys = response;
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

    handleSubmit() {
        if (this.dialogAction === "Edit") {
            this.edit();
        }
        else {
            this.add();
        }
    }

    

    add():void {
        let formData = new FormData;
        formData.set("name", this.productForm.controls.name.value);
        formData.set("categoryId", this.productForm.controls.categoryId.value);
        formData.set("price", this.productForm.controls.price.value);
        formData.set("description", this.productForm.controls.description.value);
        formData.set("uploaded_image", this.uploaded_image);
        
        this.productService.add(formData).subscribe((response: any) => {
            this.dialogRef.close();
            this.onAddProduct.emit();
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
        formData.set("name", this.productForm.controls.name.value);
        formData.set("price", this.productForm.controls.price.value);
        formData.set("categoryId", this.productForm.controls.categoryId.value);
        formData.set("description", this.productForm.controls.description.value);
        formData.set("uploaded_image", this.uploaded_image);
        
        this.productService.update(formData).subscribe((response: any) => {
            this.dialogRef.close();
            this.onEditProduct.emit();
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

//     edit() {
//             var formData = this.productForm.value;
//             var data = {
//                 id: this.dialogData.data.id,
//                 name: formData.name,
//                 categoryId: formData.categoryId,
//                 price: formData.price,
//                 description: formData.description,
//             }
//         this.productService.update(data).subscribe((response: any) => {
//                 this.dialogRef.close();
//                 this.onEditProduct.emit();
//                 this.responseMessage = response.message;
//                 this.snackbarService.openSnackBar(this.responseMessage, "success");
//             }, (error: any) => {
//                 if (error.error?.message) {
//                     this.responseMessage = error.error?.message;
//                 }
//                 else {
//                     this.responseMessage = GlobalConstants.genericError;
//                 }
//                 this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
//             })
//         }
    
//     onFileSelected(event: Event){
//         }

