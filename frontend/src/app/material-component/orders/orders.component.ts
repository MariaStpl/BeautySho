import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CheckoutService } from 'src/app/services/checkout.service';
import { OrdersService } from 'src/app/services/orders.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { environment } from 'src/environments/environment';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { OrderEditComponent } from '../dialog/order-edit/order-edit.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
    displayedColumns: string[] = ['name', 'contactNumber', 'address', 'shipping_option', 'orderTime','completedTime','status', 'edit'];
    dataSource: any;
    responseMessage: any;

    constructor(private ordersService: OrdersService,
        private ngxService: NgxUiLoaderService,
        private dialog: MatDialog,
        private snackbarService: SnackbarService,
        private router: Router) { }

    ngOnInit(): void {
        this.ngxService.start();
        this.tableData();
    }

    tableData() {
        this.ordersService.getOrders().subscribe((response: any) => {
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

    handleEditAction(values:any){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data ={
            action: 'Edit',
            data:values
        }
        dialogConfig.width = '850px';
        const dialogRef = this.dialog.open(OrderEditComponent, dialogConfig);
        this.router.events.subscribe(()=>{
            dialogRef.close();
        });
        const sub = dialogRef.componentInstance.onEditProduct.subscribe(
            (response)=>{
                this.tableData();
            }
        )
      }
    
  
      handleDeleteAction(values:any){
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = {
              message:'delete '+values.name+' order'
          };
          const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
          const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
              this.ngxService.start();
              this.deleteOrders(values.checkoutId);
              this.deleteCheckout(values.idCheck);
              dialogRef.close();
          })
  
      }

      deleteCheckout(idCheck:any){
        this.ordersService.deleteCheckout(idCheck).subscribe((response:any)=>{
            this.ngxService.stop();
            this.tableData();
            this.responseMessage = response?.message;
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
  
      deleteOrders(checkoutId:any){
          this.ordersService.delete(checkoutId).subscribe((response:any)=>{
              this.ngxService.stop();
              this.tableData();
              this.responseMessage = response?.message;
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
  
}

