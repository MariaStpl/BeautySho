import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DetailProductService } from 'src/app/services/detail-product.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { environment } from 'src/environments/environment';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { DetailProductComponent } from '../dialog/detail-product/detail-product.component';

@Component({
  selector: 'app-manage-detail-product',
  templateUrl: './manage-detail-product.component.html',
  styleUrls: ['./manage-detail-product.component.scss']
})
export class ManageDetailProductComponent implements OnInit {
    displayedColumns: string[] = ['productName','item', 'description', 'price', 'productImage',  'image', 'edit'];
    dataSource: any;
    responseMessage: any;

  constructor(private detailProductService: DetailProductService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
}

tableData() {
    this.detailProductService.getProductsDetails().subscribe((response: any) => {
        response = response.map ((data:any) =>{
            if (data.image){
                data.image = environment.apiUrl + '/images/upload_detail/' + data.image;
                if (data.productImage) {
                    data.productImage = environment.apiUrl + '/images/upload_images/' + data.productImage;
                    return data;
                }
            }
            return data
        

        })
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response)
    }, (error: any) => {
        this.ngxService.stop();
        console.log(error);
        if (error.error?.message) {
            this.responseMessage = error.error?.message;
        }
        else {
            this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
}

applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
}

handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data ={
        action: 'Add'
    }
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(DetailProductComponent, dialogConfig);
    this.router.events.subscribe(()=>{
        dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddDetailProduct.subscribe(
        (response)=>{
            this.tableData();
        }
    )
}

handleEditAction(values:any){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data ={
      action: 'Edit',
      data:values
  }
  dialogConfig.width = '850px';
  const dialogRef = this.dialog.open(DetailProductComponent, dialogConfig);
  this.router.events.subscribe(()=>{
      dialogRef.close();
  });
  const sub = dialogRef.componentInstance.onEditDetailProduct.subscribe(
      (response)=>{
          this.tableData();
      }
  )
}


handleDeleteAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
        message:'delete '+values.name+' product'
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
        this.ngxService.start();
        this.deleteProduct(values.id);
        dialogRef.close();
    })

}

deleteProduct(id:any){
    this.detailProductService.delete(id).subscribe((response:any)=>{
        this.ngxService.stop();
        this.tableData();
        this.responseMessage - response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");
    },(error:any)=>{          
        this.ngxService.stop();
        console.log(error);
        if (error.error?.message) {
            this.responseMessage = error.error?.message;
        }
        else {
            this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
}

onChange(status:any, id:any){
    var data ={
        status:status.toString(),
        id:id
    }
    this.detailProductService.updateStatus(data).subscribe((response:any)=>{
        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, "succes");
    }, (error:any)=>{
        this.ngxService.stop();
        console.log(error);
        if (error.error?.message) {
            this.responseMessage = error.error?.message;
        }
        else {
            this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
}


}

