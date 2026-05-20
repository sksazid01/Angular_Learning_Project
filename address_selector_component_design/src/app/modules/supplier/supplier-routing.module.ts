import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SupplierDetailsComponent } from './components/supplier-details/supplier-details.component';
import { SupplierInfoUpdateComponent } from './components/supplier-info-update/supplier-info-update.component';
import { SupplierListComponent } from './components/supplier-list/supplier-list.component';

const routes: Routes = [
  { path: 'list', component: SupplierListComponent },
  { path: 'create', component: SupplierInfoUpdateComponent },
  { path: 'details/:id', component: SupplierDetailsComponent },
  { path: 'edit/:id', component: SupplierInfoUpdateComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
