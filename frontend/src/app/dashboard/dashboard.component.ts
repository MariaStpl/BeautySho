import { Component, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ViewBillOrdersComponent } from '../material-component/dialog/view-bill-orders/view-bill-orders.component';
import { DashboardService } from '../services/dashboard.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
    displayedColumns: string[] = ['no','name', 'contactNumber', 'shipping_option','receipt','status', 'edit'];
    displayedColumnsProduct: string[] = ['no','name', 'total'];
    displayedColumnsItem: string[] = ['no','productName', 'item','total'];
    dataSource: any;
    dataSource1: any;
    dataSource2: any;
    responseMessage:any;
    data:any;

	ngAfterViewInit() { }

	constructor(private dashboardService:DashboardService,
        private ngxService: NgxUiLoaderService,
        private dialog: MatDialog,
        private snackbarService: SnackbarService,
        private router: Router) {
            this.ngxService.start();
            this.dashboardData();
            this.tableData();
            this.tableTopProduct();
            this.tableTopItem()
	}
    dashboardData(){
        this.dashboardService.getDetails().subscribe((response:any)=>{
            this.ngxService.stop();
            this.data = response;
        },(error:any)=>{
            this.ngxService.stop();
            console.log(error);
            if(error.error?.message){
                this.responseMessage = error.error?.message;
            }
            else{
                this.responseMessage = GlobalConstants.genericError;
            }
            this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
        })
    }
    
    tableTopProduct() {
        this.dashboardService.topProduct().subscribe((response: any) => {
            this.ngxService.stop();
            this.dataSource1 = new MatTableDataSource(response)
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

    tableTopItem() {
        this.dashboardService.topItem().subscribe((response: any) => {
            this.ngxService.stop();
            this.dataSource2 = new MatTableDataSource(response)
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
    
    tableData() {
        this.dashboardService.getOrders().subscribe((response: any) => {
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

    handleViewAction(values:any){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            data:values
        };
        dialogConfig.width="100%";
        const dialogRef = this.dialog.open(ViewBillOrdersComponent, dialogConfig);
        this.router.events.subscribe(()=>{
            dialogRef.close();
        })
    }
    

}
