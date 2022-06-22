import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HomeComponent } from './home/home.component';
import { FullComponent } from './layouts/full/full.component';
import { DetailProductComponent } from './material-component/dialog/detail-product/detail-product.component';
import { OrderComponent } from './order/order.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { RouteGuardService } from './services/route-guard.service';

const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'beautyshop',
        component: FullComponent,
        children: [
            {
                path: '',
                redirectTo: '/beautyshop/dashboard',
                pathMatch: 'full',
            },


            {
                path: '',
                loadChildren:
                    () => import('./material-component/material.module').then(m => m.MaterialComponentsModule),
                canActivate: [RouteGuardService],
                data: {
                    expectedRole: ['admin', 'user']
                }
            },
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
                canActivate: [RouteGuardService],
                data: {
                    expectedRole: ['admin', 'user']
                }
            }
        ]
    },
    {
        path: 'detail/getProductsItem/:id',
        component: ProductItemComponent,
    },
    {
        path: 'cart',
        component: CartComponent,
    },
    {
        path: 'checkout/get',
        component: CheckoutComponent,
    },
    {
        path: 'order/get',
        component: OrderComponent,
    },
    { path: '**', component: HomeComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
