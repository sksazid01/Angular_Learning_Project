import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SupplierDetailsComponent } from './components/supplier-details/supplier-details.component';
import { SupplierInfoUpdateComponent } from './components/supplier-info-update/supplier-info-update.component';
import { SupplierListComponent } from './components/supplier-list/supplier-list.component';
import { ROUTES } from 'src/app/core/constants/routes.constants';

const routes: Routes = [
  { path: '',                      redirectTo: ROUTES.supplier.list, pathMatch: 'full' },
  { path: ROUTES.supplier.list,    component: SupplierListComponent },
  { path: ROUTES.supplier.create,  component: SupplierInfoUpdateComponent },
  { path: ROUTES.supplier.details, component: SupplierDetailsComponent },
  { path: ROUTES.supplier.edit,    component: SupplierInfoUpdateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
