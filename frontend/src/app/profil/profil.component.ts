import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfilService } from '../services/profil.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute,
    private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
        console.log(params) //log the entire params object
        console.log(params['id'])
        this.profilDisplay(params.id)
    }) 
  }

  profilDisplay(id: any) {
    this.profilService.get(id).subscribe((response: any) => {
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
