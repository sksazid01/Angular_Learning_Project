import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddressModule } from '../address/address.module';
import { SupplierDetailsComponent } from './components/supplier-details/supplier-details.component';
import { SupplierInfoUpdateComponent } from './components/supplier-info-update/supplier-info-update.component';
import { SupplierListComponent } from './components/supplier-list/supplier-list.component';
import { SupplierRoutingModule } from './supplier-routing.module';

@NgModule({
  declarations: [
    SupplierDetailsComponent,
    SupplierInfoUpdateComponent,
    SupplierListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SupplierRoutingModule,
    AddressModule,
    ReactiveFormsModule
  ]
})
export class SupplierModule { }
