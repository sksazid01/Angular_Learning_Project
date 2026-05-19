import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'suppliers', loadChildren: './features/supplier/supplier.module#SupplierModule' },
  { path: 'addresss', loadChildren: './features/address/address.module#AddressModule' },
  { path: '', redirectTo: '/addresss', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
