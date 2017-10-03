import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MenuComponent} from './menu.component';
import {StoresComponent} from '../stores/stores.component';
import {CartComponent} from '../cart/cart.component';
import {ProductDetailComponent} from '../product-detail/product-detail.component';
import {UserProfileComponent} from '../user-profile/user-profile.component';
import {CheckoutComponent} from '../checkout/checkout.component';
import { HomeComponent } from '../home/home.component';
import { TransactionsComponent } from '../transactions/transactions.component';
import { PortfolioDetailComponent } from '../portfolio-detail/portfolio-detail.component';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MenuComponent,
        children: [
          {
            path: 'store',
            component: StoresComponent
          },
          {
            path: 'cart',
            component: CartComponent
          },
          {
            path: 'product/detail/:id',
            component: ProductDetailComponent
          },
          {
            path: 'profile',
            component: UserProfileComponent
          },
          {
            path: 'checkout',
            component: CheckoutComponent
          },
          {
            path: 'transactions',
            component: TransactionsComponent
          },
          {
            path: 'portfolio/detail/:id',
            component: PortfolioDetailComponent
          },
          {
            path: 'transaction/detail/:id',
            component: TransactionDetailComponent
          }
        ],
      },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class MenuRoutingModule {
}
