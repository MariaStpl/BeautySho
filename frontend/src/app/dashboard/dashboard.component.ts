import { ListKeyManager } from '@angular/cdk/a11y';
import { WHITE_ON_BLACK_CSS_CLASS } from '@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector';
import { Component, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ViewBillOrdersComponent } from '../material-component/dialog/view-bill-orders/view-bill-orders.component';
import { DashboardService } from '../services/dashboard.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';


// const barChartOptions = {
//     scaleShowVerticalLines: false,
//     responsive: true
//   };
//   const barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
//   const barChartType = 'bar';
//   const barChartLegend = true;
//   const barChartData = [
//     {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
//     {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
//   ];


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
    displayedColumns: string[] = ['no', 'name', 'contactNumber', 'shipping_option', 'receipt', 'status', 'edit'];
    displayedColumnsProduct: string[] = ['no', 'name', 'total'];
    displayedColumnsItem: string[] = ['no', 'productName', 'item', 'total'];
    dataSource: any;
    dataSource1: any;
    dataSource2: any;
    responseMessage: any;
    data: any;
    chartItem: any;
    chartProduct: any;
    nilaiItem: any = [];
    nilaiProduct: any = [];
    public barChartDataItem: any = [];
    public barChartLabelsProduct: any = [];
    public barChartDataProduct: any = [];
    public barChartLabelsItem: any = [];

    ngAfterViewInit() { }

    public barChartColors: Color[] = [
        {
            backgroundColor: [
                '#96ceb4',
                '#ffeead',
                '#ffcc5c',
                '#ff6f69',
                '#d96459'
            ],
            borderColor: 'white',
            hoverBorderWidth: 4
        },
    ]
    public barChartOptions: ChartOptions = {
        responsive: true,
        legend:{
            position:'bottom',
        },
        scales: {   
            xAxes: [{
                display:false,
                position: 'center',
                scaleLabel: {
                    fontStyle: 'bold',
                    fontFamily: 'Lato, sans-serif',
                  },
                  ticks: {
                    maxRotation: 0,
                    minRotation: 0,
                    fontSize:10,
                } 
              }],
            yAxes: [{
                ticks: {
                    min: 0
                }
            }]
        }
    };
    public barChartType: ChartType = 'bar';
    public barChartLegend = false;


    constructor(private dashboardService: DashboardService,
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

    dashboardData() {
        this.dashboardService.getDetails().subscribe((response: any) => {
            this.ngxService.stop();
            this.data = response;
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

    tableTopProduct() {
        this.dashboardService.topProduct().subscribe((response: any) => {
            this.ngxService.stop();
            this.dataSource1 = new MatTableDataSource(response)
            this.chartProduct = response.map((data: any) => {
                this.nilaiProduct.push(data.total)
                this.barChartDataProduct = [
                    { data: this.nilaiProduct, label: 'Sold' },
                ];
                this.barChartLabelsProduct.push(data.name)
                return data
            })
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
            this.chartItem = response.map((data: any) => {
                this.nilaiItem.push(data.total)
                this.barChartDataItem = [
                    { data: this.nilaiItem, label: 'Sold' },
                ];
                this.barChartLabelsItem.push(data.productName)
                return data
            })
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

    handleViewAction(values: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            data: values
        };
        dialogConfig.width = "100%";
        dialogConfig.maxHeight = "100%";
        const dialogRef = this.dialog.open(ViewBillOrdersComponent, dialogConfig);
        this.router.events.subscribe(() => {
            dialogRef.close();
        })
    }
}
