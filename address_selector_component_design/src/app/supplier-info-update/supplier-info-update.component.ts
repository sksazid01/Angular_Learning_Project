import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Supplier, SupplierService } from '../supplier.service';
import { LocationFormComponent } from '../location-form/location-form.component';
import { NotificationService } from '../notification/notification.service';
import { Address } from '../location-form/location-form.model';
import { ConfirmationPopupService } from '../confirmation-popup/confirmation-popup.service';

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
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private confirmationPopupService: ConfirmationPopupService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.supplierService.getSupplier(Number(id)).subscribe(s => this.supplier = s);
    } else {
      this.isNewSupplier = true;
    }
  }

  // validate name
  isSupplierValid(): boolean {
    if (!this.supplier) return false;

    if (!this.supplier.name || this.supplier.name.trim() === '') {
      this.notificationService.showNotification('Supplier name is required', true);
      return false;
    }
    return true;
  }

  // If location form exists and valid, get address; else use empty address
  getSupplierLocation() {
    let addressData = new Address();
    if (this.locationForm && this.locationForm.locationForm && this.locationForm.locationForm.valid) {
      addressData = this.locationForm.getAddressFromAddressForm();
    }

    this.supplier.address = addressData;
  }

  saveSupplier() {
    if (this.isNewSupplier) {
      this.confirmationPopupService.confirm(() => {
        this.supplierService.addSupplier(this.supplier).subscribe(newSupplier => {
          this.router.navigate(['/suppliers', newSupplier.id]);
        });
      }, null, 'Are you sure to add this supplier?', 'Add Confirmation');
    } else {
      this.confirmationPopupService.confirm(() => {
        this.supplierService.updateSupplier(this.supplier.id, this.supplier).subscribe(() => {
          this.router.navigate(['/suppliers', this.supplier!.id]);
        });
      }, null, 'Are you sure to update this supplier?', 'Update Confirmation');
    }
  }

  onSupplierSave() {
    if (!this.isSupplierValid()) return;
    this.getSupplierLocation();
    this.saveSupplier();
  }

  goBack() {
    if (this.isNewSupplier) {
      this.router.navigate(['/suppliers']);
    } else {
      this.router.navigate(['/suppliers', this.supplier.id]);
    }
  }
}
