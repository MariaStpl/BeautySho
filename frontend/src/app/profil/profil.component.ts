import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfilService } from '../services/profil.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
    responseMessage: any;
    public profilView:any;

  constructor(private profilService:ProfilService,
    private ngxService:NgxUiLoaderService,
    private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.profilDisplay()
  }

  profilDisplay() {
    this.profilService.get().subscribe((response: any) => {
        this.ngxService.stop();
        this.profilView = response.map((data: any) => {
            // if (data.itemImage) {
            //     data.itemImage = environment.apiUrl + '/images/upload_detail/' + data.itemImage;
            //     return data;
            // }
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

}
