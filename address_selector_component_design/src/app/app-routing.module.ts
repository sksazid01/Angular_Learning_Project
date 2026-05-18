import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierDetailsComponent } from './supplier-details/supplier-details.component';
import { SupplierInfoUpdateComponent } from './supplier-info-update/supplier-info-update.component';
import { AddressListComponent } from './address-lists/address-lists.component';

const routes: Routes = [
  { path: 'suppliers', component: SupplierListComponent },
  { path: 'suppliers/new', component: SupplierInfoUpdateComponent },
  { path: 'suppliers/:id', component: SupplierDetailsComponent },
  { path: 'suppliers/:id/edit', component: SupplierInfoUpdateComponent },
  { path: 'addresss', component: AddressListComponent },
  { path: '', redirectTo: '/addresss', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
