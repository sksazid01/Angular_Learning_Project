import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmationPopupService } from '../../../../shared/components/confirmation-popup/confirmation-popup.service';
import { AddressFormComponent } from '../../../address/components/address-form/address-form.component';
import { Address } from '../../../address/models/address.model';
import { Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-info-update',
  templateUrl: './supplier-info-update.component.html',
  styleUrls: ['./supplier-info-update.component.css']
})
export class SupplierInfoUpdateComponent implements OnInit {
  supplier: Supplier = { id: 0, name: '', address: undefined };
  isNewSupplier = false;

  @ViewChild(AddressFormComponent) addressForm!: AddressFormComponent;

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

  onSupplierSave() {
    if (!this.isSupplierValid()) return;
    this.getSupplierAddress();
    this.saveSupplier();
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

  // If address form exists and valid, get address; else use empty address
  getSupplierAddress() {
    let addressData = new Address();
    if (this.addressForm && this.addressForm.addressForm && this.addressForm.addressForm.valid) {
      addressData = this.addressForm.getAddressFromAddressForm();
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

  goBack() {
    if (this.isNewSupplier) {
      this.router.navigate(['/suppliers']);
    } else {
      this.router.navigate(['/suppliers', this.supplier.id]);
    }
  }
}
