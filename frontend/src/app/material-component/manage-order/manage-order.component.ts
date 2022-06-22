import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'console';
import { NgxUiLoaderConfig, NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { saveAs } from 'file-saver';
import { threadId } from 'worker_threads';
import { DetailProductService } from 'src/app/services/detail-product.service';

@Component({
    selector: 'app-manage-order',
    templateUrl: './manage-order.component.html',
    styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

    displayedColumns:string[] = ['category','product','item', 'price', 'quantity', 'total', 'edit'];
    dataSource: any = [];
    manageOrderForm: any = FormGroup;
    details: any = [];
    categorys: any = [];
    products: any = [];
    price: any;
    totalAmount: number = 0;
    responseMessage: any;

    constructor(private formBuilder: FormBuilder,
        private productService: ProductService,
        private categoryService: CategoryService,
        private detailProductService: DetailProductService,
        private snackbarService: SnackbarService,
        private billService: BillService,
        private ngxService: NgxUiLoaderService) { }

    ngOnInit(): void {
        this.ngxService.start();
        this.getCategorys();
        this.getProducts();
        this.manageOrderForm = this.formBuilder.group({
            name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
            email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
            contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
            paymentMethod: [null, [Validators.required]],
            item: [null, [Validators.required]],
            category: [null, [Validators.required]],
            product: [null, [Validators.required]],
            detail: [null, [Validators.required]],
            quantity: [null, [Validators.required]],
            price: [null, [Validators.required]],
            total: [0, [Validators.required]],
        })
    }

    getProducts() {
        this.productService.getProducts().subscribe((response: any) => {
            this.ngxService.stop();
            this.products = response;
            console.log(this.products);
            
        }, (error: any) => {
            this.ngxService.stop();
            if (error.error?.message) {
                this.responseMessage = error.error?.message;
            }
            else {
                this.responseMessage = GlobalConstants.genericError;
            }
            this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
        })
    }

    getCategorys() {
        this.categoryService.getCategorys().subscribe((response: any) => {
            this.ngxService.stop();
            this.categorys = response;
        }, (error: any) => {
            this.ngxService.stop();
            if (error.error?.message) {
                this.responseMessage = error.error?.message;
            }
            else {
                this.responseMessage = GlobalConstants.genericError;
            }
            this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
        })
    }

    getProductsByCategory(value: any) {
        this.productService.getProductsByCategory(value.id).subscribe((response: any) => {
            this.products = response;
            this.manageOrderForm.controls['price'].setValue('');
            this.manageOrderForm.controls['quantity'].setValue('');
            this.manageOrderForm.controls['total'].setValue(0);
        }, (error: any) => {
            this.ngxService.stop();
            if (error.error?.message) {
                this.responseMessage = error.error?.message;
            }
            else {
                this.responseMessage = GlobalConstants.genericError;
            }
            this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
        })
    }

    getItemsByProduct(value: any) {
        this.detailProductService.getItemsByProduct(value.id).subscribe((response: any) => {
            this.details = response;
            this.manageOrderForm.controls['price'].setValue('');
            this.manageOrderForm.controls['quantity'].setValue('');
            this.manageOrderForm.controls['total'].setValue(0);
        }, (error: any) => {
            this.ngxService.stop();
            if (error.error?.message) {
                this.responseMessage = error.error?.message;
            }
            else {
                this.responseMessage = GlobalConstants.genericError;
            }
            this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
        })
    }

    getProductDetails(value: any) {
        this.detailProductService.getById(value.id).subscribe((response:any) => {
            this.price = response.price;
            this.manageOrderForm.controls['price'].setValue(response[0].price);
            this.manageOrderForm.controls['quantity'].setValue('1');
            this.manageOrderForm.controls['total'].setValue(this.price*1);
        }, (error: any) => {
            this.ngxService.stop();
            if (error.error?.message) {
                this.responseMessage = error.error?.message;
            }
            else {
                this.responseMessage = GlobalConstants.genericError;
            }
            this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
        })

    }

    setQuantity(value: any) {
        var formData = this.manageOrderForm.value;
        var temp = this.manageOrderForm.controls['quantity'].value;
        if (temp > 0) {
            this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
        }
        else if (temp !='') {
            this.manageOrderForm.controls['quantity'].setValue('1');
            this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value)
        }
    }

    validateProductAdd() {
        if (this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null || this.manageOrderForm.controls['quantity'].value <= 0)
            return true;

        else
            return false;
    }

    validateSubmit() {
        if (this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null ||
            this.manageOrderForm.controls['email'].value === null ||
            this.manageOrderForm.controls['contactNumber'].value === null ||
            this.manageOrderForm.controls['paymentMethod'].value === null ||
            !(this.manageOrderForm.controls['contactNumber'].valid) ||
            !(this.manageOrderForm.controls['email'].valid))
            return true;

        else
            return false

    }

    add() {
        var formData = this.manageOrderForm.value;
        var productItem = this.dataSource.find((e:{id: number; }) => e.id == formData.detail.id);
        if (productItem === undefined) {
            this.totalAmount = this.totalAmount + formData.total;
            this.dataSource.push({
                id: formData.detail.id, 
                item: formData.detail.item,
                category: formData.category.name, 
                product: formData.product.name, 
                quantity: formData.quantity,
                price: formData.price, 
                total: formData.total
            });
            console.log(this.dataSource);
            
            this.dataSource = [...this.dataSource];
            this.snackbarService.openSnackBar(GlobalConstants.productAdded, "success");
        }
        else{
            this.snackbarService.openSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
        }
    }


    handleDeleteAction(value: any, element: any) {
        this.totalAmount = this.totalAmount - element.total;
        this.dataSource.splice(value, 1);
        this.dataSource = [...this.dataSource];
    }

    submitAction() {
        this.ngxService.start();
        var formData = this.manageOrderForm.value;
        var data = {
            name: formData.name,
            email: formData.email,
            contactNumber: formData.contactNumber,
            paymentMethod: formData.paymentMethod,
            totalAmount: this.totalAmount,
            productDetails: JSON.stringify(this.dataSource)
        }
        this.billService.generateReport(data).subscribe((response: any) => {
            this.downloadFile(response?.uuid);
            console.log(response?.email);
            
            this.manageOrderForm.reset();
            this.dataSource = [];
            this.totalAmount = 0;
            console.log(response?.uuid);
            
        }, (error: any) => {
            this.ngxService.stop();
            if (error.error?.message) {
                this.responseMessage = error.error?.message;
            }
            else {
                this.responseMessage = GlobalConstants.genericError;
            }
            this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
        })
    }

    downloadFile(fileName: any) {
        var data = {
            uuid: fileName
        }
        this.billService.getPDF(data).subscribe((response: any) => {
            saveAs(response, fileName + '.pdf');
            this.ngxService.stop();
        })
    }
}
