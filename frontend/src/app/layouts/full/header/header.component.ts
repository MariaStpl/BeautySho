import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, Routes } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ChangePasswordComponent } from 'src/app/material-component/dialog/change-password/change-password.component';
import { ConfirmationComponent } from 'src/app/material-component/dialog/confirmation/confirmation.component';
import { NotificationService } from 'src/app/services/notification.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [],
})
export class AppHeaderComponent {
  public totalItem: number = 0;
  role: any;
  public notifList: any;
  public responseMessage: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private snackbarService: SnackbarService
  ) {
    this.openNotif();
  }

  openNotif() {
    this.notificationService.get().subscribe(
      (response: any) => {
        this.totalItem = 0;
        this.notifList = response.map((data: any) => {
          console.log(data.statusNotif);
          if (data.statusNotif === 'Unread') {
            this.totalItem = this.totalItem + 1;
          }
          return data;
        });
      },
      (error: any) => {
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

  detailOrder(checkoutId: any) {
    var data = {
      checkoutId: checkoutId,
    };
    this.notificationService.update(data).subscribe(
      (response: any) => {
        this.router.navigate(['/beautyshop/orders']);
      },
      (error: any) => {
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

  logout() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Logout',
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (user) => {
        dialogRef.close();
        localStorage.clear();
        this.router.navigate(['/administrator']);
      }
    );
  }
  changePassword() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }
}
