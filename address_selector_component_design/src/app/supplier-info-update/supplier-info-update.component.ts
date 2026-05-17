import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Supplier, SupplierService } from '../supplier.service';
import { LocationFormComponent } from '../location-form/location-form.component';

@Component({
  selector: 'app-supplier-info-update',
  templateUrl: './supplier-info-update.component.html',
  styleUrls: ['./supplier-info-update.component.css']
})
export class SupplierInfoUpdateComponent implements OnInit {
  supplier: Supplier = { id: 0, name: '', address: undefined };
  isNewSupplier = false;
  @ViewChild(LocationFormComponent) locationForm!: LocationFormComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.supplierService.getSupplier(Number(id)).subscribe(s => this.supplier = s);
    } else {
      this.isNewSupplier = true;
    }
  }

  saveSupplier() {
    if (this.supplier && this.locationForm && this.locationForm.locationForm.valid) {
      
      const formValue = this.locationForm.locationForm.value;
      const fullAddressData = (this.locationForm as any).getAddressDataFromFormValues(formValue);
      this.supplier.address = fullAddressData;
      
      if (this.isNewSupplier) {
        this.supplierService.addSupplier(this.supplier).subscribe(newSupplier => {
          this.router.navigate(['/suppliers', newSupplier.id]);
        });
      } else {
        this.supplierService.updateSupplier(this.supplier.id, this.supplier).subscribe(() => {
          this.router.navigate(['/suppliers', this.supplier!.id]);
        });
      }
    }
  }
}
