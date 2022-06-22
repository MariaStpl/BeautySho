import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from '../services/product.service';
import { SnackbarService } from '../services/snackbar.service';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../shared/global-constants';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-best-seller',
    templateUrl: './best-seller.component.html',
    styleUrls: ['./best-seller.component.scss']
})
export class BestSellerComponent implements OnInit {
    responseMessage: any;
    public productList: any;
    url = environment.apiUrl;


    constructor(private productService: ProductService,
        private router: Router) { }

    ngOnInit(): void {
        this.productService.getProductsHome().subscribe((res: any) => {
            this.productList = res.map((data: any) => {
                if (data.image) {
                    data.image = environment.apiUrl + '/images/upload_images/' + data.image;
                    if (data.categoryIcon) {
                        data.categoryIcon = environment.apiUrl + '/images/upload_icons/' + data.categoryIcon;
                        return data;
                    }
                }
                return data
            })
        })
    }
    ImageClick(id:any){
        this.router.navigate(['/detail/getProductsItem/'+ id])
        //this.router.navigateByUrl(`/detail/getProductsItem/${id}`)
    }

}
