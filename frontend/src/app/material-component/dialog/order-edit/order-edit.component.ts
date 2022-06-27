import { Component, OnInit,EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'src/app/services/orders.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { OrdersComponent } from '../../orders/orders.component';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit {
    onEditProduct = new EventEmitter();
    ordersForm: any = FormGroup;
    dialogAction: any = "Add";
    action: any = "Add";
    responseMessage: any;

    constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<OrdersComponent>,
    private snackbarService: SnackbarService,
    private ordersService: OrdersService,
) { }

ngOnInit(): void {
    this.ordersForm = this.formBuilder.group({
        status: [null, Validators.required],
    })

    if (this.dialogData.action === 'Edit') {
        this.dialogAction = "Edit";
        this.action = "Update";
        this.ordersForm.patchValue(this.dialogData.data);
    }
}

handleSubmit() {
    if (this.dialogAction === "Edit") {
        this.edit();
    }
    else {
        
    }
}

  edit() {
    var formData = this.ordersForm.value;
    var data = {
        idCheck: this.dialogData.data.idCheck,
        status: formData.status,
    }
    this.ordersService.update(data).subscribe((response: any) => {
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
}

}

