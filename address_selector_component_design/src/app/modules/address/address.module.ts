import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AddressFormComponent } from './components/address-form/address-form.component';
import { AddressPreviewComponent } from './components/address-preview/address-preview.component';

@NgModule({
  declarations: [
    AddressFormComponent,
    AddressPreviewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    AddressFormComponent,
    AddressPreviewComponent
  ]
})
export class AddressModule { }
