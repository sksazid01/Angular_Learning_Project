import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AddressRoutingModule } from './address-routing.module';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { AddressListComponent } from './components/address-lists/address-lists.component';
import { AddressPreviewComponent } from './components/address-preview/address-preview.component';

@NgModule({
  declarations: [
    AddressFormComponent,
    AddressListComponent,
    AddressPreviewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddressRoutingModule
  ],
  exports: [
    AddressFormComponent,
    AddressPreviewComponent
  ]
})
export class AddressModule { }
