import { Component, OnInit } from '@angular/core';
import { DetailProductService } from '../services/detail-product.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog} from '@angular/material/dialog';
import { GlobalConstants } from '../shared/global-constants';
import { SnackbarService } from '../services/snackbar.service';
import { CartService } from '../services/cart.service';
import { MessengerService } from '../services/messenger.service';

@Component({
    selector: 'app-product-item',
    templateUrl: './product-item.component.html',
    styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
    responseMessage: any;
    public totalItem: number = 0;
    //public productList:Array<any> = [];
    public detailProduct: any;
    singleProduct: any;
    selectedValue: any = [];
    dataSource: any = [];


    constructor(private detailProductService: DetailProductService,
        private route: ActivatedRoute, private dialog: MatDialog, private snackbarService: SnackbarService,
        private msg: MessengerService,
        private cartService: CartService,
        private router: Router) { }

    // ngOnInit():void {
    //     let id = 0;
    //     this.activatedRoute.paramMap.subscribe((data:any)=>{
    //         id = data.params.id
    //         this.detailProductService.getProductsItem('productList').subscribe((res:any)=>{
    //             this.productList = res
    //             this.productList = this.productList.filter((data:any)=> data.id == id);
    //             if(this.productList.length<=0){
    //                 this.route.navigateByUrl('');
    //             }
    //             this.singleProduct = this.productList[0];
    //             console.log(this.singleProduct)
    //         },(error:any)=>{
    //             console.log(error);

    //         })
    //     })
    // }


    ngOnInit(): void {
        this.route.params.subscribe(params => {
            console.log(params) //log the entire params object
            console.log(params['id'])
            this.detailItem(params.id)
        })   
        this.cartService.getCart().subscribe((response: any) => {
            this.totalItem = response.length;
            
        })

        
    }

    detailItem(id: any) {
        this.detailProductService.getProductsItem(id).subscribe((res: any) => {
            this.detailProduct = res.map((data: any) => {
                if (data.image) {
                    data.image = environment.apiUrl +
                        '/images/upload_detail/' + data.image;
                    if (data.productImage) {
                        data.productImage = environment.apiUrl +
                            '/images/upload_images/' + data.productImage;
                        return data;
                    }
                }
                return data
            })
            this.singleProduct = this.detailProduct[0];

        })
    }

    onChange(event: any) {
        this.singleProduct = this.selectedValue
    }

    handleAddToCart() {
        this.cartService.addProductToCart(this.singleProduct).subscribe(() => {
            this.singleProduct
            this.snackbarService.openSnackBar(GlobalConstants.productAdded, "success");
        })
        window.location.reload();
        console.log(this.singleProduct.itemPrice);
        
        
    }
}


