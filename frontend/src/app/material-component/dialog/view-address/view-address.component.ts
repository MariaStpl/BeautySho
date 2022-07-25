import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { AddAddressComponent } from '../add-address/add-address.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
    selector: 'app-view-address',
    templateUrl: './view-address.component.html',
    styleUrls: ['./view-address.component.scss']
})
export class ViewAddressComponent implements OnInit {
    displayedColumns: string[] = ['address', 'edit'];
    responseMessage: any;
    userID: any;
    addressdata: any;
    onViewAddress = new EventEmitter();

    constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
        public dialogRef: MatDialogRef<ViewAddressComponent>,
        public userService: UserService,
        private ngxService: NgxUiLoaderService,
        private snackbarService: SnackbarService,
        private dialog: MatDialog,
        private router: Router) { }

    ngOnInit() {
        this.getAddress()
    }

    getAddress() {
        this.userService.checkToken().subscribe(
            (response: any) => {
                this.userID = response.id;
                this.userService
                    .getAddressByUser(this.userID)
                    .subscribe((response: any) => {
                        this.addressdata = response;
                    });
                    this.onViewAddress.emit();
            },
            (error: any) => {
                console.log(error);
            }
        );
    }


    handleEditAction(values: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            action: 'Edit',
            data: values,
        };
        dialogConfig.width = '850px';
        const dialogRef = this.dialog.open(AddAddressComponent, dialogConfig);
        this.router.events.subscribe(() => {
            dialogRef.close();
        });
        const sub = dialogRef.componentInstance.onEditAddress.subscribe(
            (response) => {
                this.getAddress();
            }
        );
    }

    handleDeleteAction(values: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            message: 'delete address product',
        };
        const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
        const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
            (response) => {
                this.ngxService.start();
                this.deleteProduct(values.id);
                dialogRef.close();
            }
        );
    }

    deleteProduct(id: any) {
        this.userService.deleteAddress(id).subscribe(
            (response: any) => {
                this.ngxService.stop();
                this.getAddress();
                this.responseMessage = response?.message;
                this.snackbarService.openSnackBar(this.responseMessage, 'success');
            },
            (error: any) => {
                this.ngxService.stop();
                console.log(error);
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
