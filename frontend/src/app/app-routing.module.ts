import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CmsComponent } from './cms/cms.component';
import { FogotPasswordCmsComponent } from './fogot-password-cms/fogot-password-cms.component';
import { HomeComponent } from './home/home.component';
import { FullComponent } from './layouts/full/full.component';
import { DetailProductComponent } from './material-component/dialog/detail-product/detail-product.component';
import { OrderComponent } from './order/order.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { ProfilComponent } from './profil/profil.component';
import { RouteGuardService } from './services/route-guard.service';
import { SignupCmsComponent } from './signup-cms/signup-cms.component';
import { TrackingComponent } from './tracking/tracking.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'administrator', component: CmsComponent },
    { path: 'administrator/signup', component: SignupCmsComponent },
    { path: 'administrator/forgotPassword', component: FogotPasswordCmsComponent },
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
                    expectedRole: ['admin']
                }
            },
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
                canActivate: [RouteGuardService],
                data: {
                    expectedRole: ['admin']
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
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['user']
        }
    },
    {
        path: 'order/get/:id',
        component: OrderComponent,
    },
    {
        path: 'order/getAll',
        component: OrderComponent,
    },
    {
        path: 'tracking/get/:receipt',
        component: TrackingComponent,
    },
    {
        path: 'profil',
        component: ProfilComponent,
    },
    { path: '**', component: HomeComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
