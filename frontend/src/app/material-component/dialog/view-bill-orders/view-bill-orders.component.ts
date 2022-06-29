import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/services/orders.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-bill-orders',
  templateUrl: './view-bill-orders.component.html',
  styleUrls: ['./view-bill-orders.component.scss']
})
export class ViewBillOrdersComponent implements OnInit {
    displayedColumns:string []= ['name', 'size', 'price', 'quantity', 'total'];
    dataSource:any;
    data:any;
    responseMessage: any;
    public ord: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  public dialogRef: MatDialogRef<ViewBillOrdersComponent>,
  private ordersService:OrdersService,
  private dialog: MatDialog,
  private snackbarService: SnackbarService) { }

  ngOnInit() {
      this.data = this.dialogData.data;
      this.dataSource = this.dialogData.data.items
      //this.tableData()
  }

//   tableData() {
//     this.ordersService.getOrders().subscribe((response: any) => {
//         response = response.map((data: any) => {
//             data.items.map((dataa: any) => {
//                 return dataa
//             })
//             return data
//         })
//         this.responseMessage = response.message;
//     }, (error: any) => {
//         console.log(error);
//         if (error.error?.message) {
//             this.responseMessage = error.error?.message;
//         }
//         else {
//             this.responseMessage = GlobalConstants.genericError;
//         }
//         this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
//     })
// }
}