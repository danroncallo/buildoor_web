import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import {ProductPipe, ProductsComponent} from '../products/products.component';
import { DataTableModule } from 'angular2-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ImageUploadModule } from 'angular2-image-upload';
import { CategoriesComponent } from '../categories/categories.component';
import { UsesComponent } from '../uses/uses.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MdButtonModule, MdCheckboxModule, MdInputModule, MdIconModule, MdTooltipModule, MdSlideToggleModule } from '@angular/material';
import 'hammerjs';
import { FacebookModule } from 'ngx-facebook';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    ModalModule.forRoot(),
    ImageUploadModule.forRoot(),
    MultiselectDropdownModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    MdButtonModule,
    MdCheckboxModule,
    MdInputModule,
    MdIconModule,
    MdTooltipModule,
    MdSlideToggleModule,
    FacebookModule.forRoot()
  ],
  declarations: [
    AdminComponent,
    ProductsComponent,
    CategoriesComponent,
    UsesComponent,
    DashboardComponent,
    ProductPipe
  ],
  exports: [AdminComponent]
})
export class AdminModule { }
