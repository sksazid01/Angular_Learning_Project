import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SupplierDetailsComponent } from './components/supplier-details/supplier-details.component';
import { SupplierInfoUpdateComponent } from './components/supplier-info-update/supplier-info-update.component';
import { SupplierListComponent } from './components/supplier-list/supplier-list.component';

const routes: Routes = [
  { path: '', component: SupplierListComponent },
  { path: 'new', component: SupplierInfoUpdateComponent },
  { path: ':id', component: SupplierDetailsComponent },
  { path: ':id/edit', component: SupplierInfoUpdateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
