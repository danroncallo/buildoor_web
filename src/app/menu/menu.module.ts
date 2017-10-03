import { NgModule } from '@angular/core';
import { MenuRoutingModule } from './menu-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ImageUploadModule } from 'angular2-image-upload';
import { MenuComponent } from './menu.component';
import {CommaSeparatedNumberPipe, StoresComponent} from '../stores/stores.component';
import {CartComponent, CartPipe} from '../cart/cart.component';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import {CheckoutComponent, CheckoutPipe} from '../checkout/checkout.component';
import { CustomFormsModule } from 'ng2-validation';
import { HomeComponent } from '../home/home.component';
import {TransactionPipe, TransactionsComponent} from '../transactions/transactions.component';
import { PortfolioDetailComponent } from '../portfolio-detail/portfolio-detail.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DetailPipe, TransactionDetailComponent} from '../transaction-detail/transaction-detail.component';

@NgModule({
  imports: [
    CommonModule,
    MenuRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    CustomFormsModule,
    ModalModule.forRoot(),
    ImageUploadModule.forRoot(),
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot()
  ],
  declarations: [
    MenuComponent,
    StoresComponent,
    CartComponent,
    ProductDetailComponent,
    UserProfileComponent,
    CheckoutComponent,
    HomeComponent,
    TransactionsComponent,
    PortfolioDetailComponent,
    TransactionDetailComponent,
    CommaSeparatedNumberPipe,
    CartPipe,
    CheckoutPipe,
    TransactionPipe,
    DetailPipe
  ],
  exports: [MenuComponent]
})
export class MenuModule { }
