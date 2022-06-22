import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { DetailProductService } from 'src/app/services/detail-product.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {
    isPhotoError = false;
    submitted: boolean = false;
    uploadError: string = '';
    onAddDetailProduct = new EventEmitter();
    onEditDetailProduct = new EventEmitter();
    detailProductForm: any = FormGroup;
    dialogAction: any = "Add";
    action: any = "Add";
    responseMessage: any;
    products: any = [];
    image: any;
    uploaded_image:any;

    constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private detailProductService: DetailProductService,
    public dialogRef: MatDialogRef<DetailProductComponent>,
    private productService: ProductService,
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
    this.detailProductForm = this.formBuilder.group({
        image: ['', Validators.compose([Validators.required])],
        item: ['', Validators.compose([Validators.required])],
        productId: ['', Validators.compose([Validators.required])],
        price: ['', Validators.compose([Validators.required])],
        description: ['', Validators.compose([Validators.required])],
    })
    if (this.dialogData.action === 'Edit') {
        this.dialogAction = "Edit";
        this.action = "Update";
        this.detailProductForm.patchValue(this.dialogData.data);
    }
    this.getProducts();
}


getProducts() {
    this.productService.getProducts().subscribe((response: any) => {
        this.products = response;
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
        this.addProductsDetails();
    }
}



addProductsDetails():void {
    let formData = new FormData;
    formData.set("item", this.detailProductForm.controls.item.value);
    formData.set("productId", this.detailProductForm.controls.productId.value);
    formData.set("price", this.detailProductForm.controls.price.value);
    formData.set("description", this.detailProductForm.controls.description.value);
    formData.set("uploaded_image", this.uploaded_image);
    
    this.detailProductService.addProductsDetails(formData).subscribe((response: any) => {
        this.dialogRef.close();
        this.onAddDetailProduct.emit();
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
    formData.set("productId", this.detailProductForm.controls.productId.value);
    formData.set("item", this.detailProductForm.controls.item.value);
    formData.set("price", this.detailProductForm.controls.price.value);
    formData.set("description", this.detailProductForm.controls.description.value);
    formData.set("uploaded_image", this.uploaded_image);
    
    this.detailProductService.update(formData).subscribe((response: any) => {
        this.dialogRef.close();
        this.onEditDetailProduct.emit();
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
