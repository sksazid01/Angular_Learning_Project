import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmationPopupService } from '../../../../shared/components/confirmation-popup/confirmation-popup.service';
import { AddressFormComponent } from '../../../address/components/address-form/address-form.component';
import { Address } from '../../../address/domain/address.domain';
import { Supplier } from '../../domain/supplier.domain';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-info-update',
  templateUrl: './supplier-info-update.component.html',
  styleUrls: ['./supplier-info-update.component.css']
})
export class SupplierInfoUpdateComponent implements OnInit {
  isNewSupplier = false;
  supplierId: number;
  supplierForm!: FormGroup;
  supplier: Supplier = new Supplier();
  @ViewChild(AddressFormComponent) addressForm!: AddressFormComponent;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private confirmationPopupService: ConfirmationPopupService
  ) { }

  ngOnInit(): void {
    this.prepareForm(null);
    this.route.params.subscribe((params) => {
      this.supplierId = params.id;
      this.isNewSupplier = !this.supplierId;
      this.fetchSupplierById(this.supplierId);
    })
  }

  prepareForm(formData: Supplier): void {
    formData = formData || new Supplier();

    this.supplierForm = this.formBuilder.group({
      id: [formData.id],
      name: [formData.name, Validators.required]
    });
  }

  fetchSupplierById(id: number): void {
    if (!id) { return; }

    this.supplierService.fetchSupplierById(id)
      .subscribe(supplier => {
        this.supplier = supplier;
        this.prepareForm(supplier);
      }
      );
  }
  onSupplierSave(): void {
    this.supplierForm.markAsTouched();
    if (!this.supplierForm.valid || !this.addressForm.isFormValid()) {
      this.notificationService.showNotification('Form invalid', true);
      return;
    }

    this.supplier = this.supplierForm.getRawValue();
    this.supplier.address = this.buildAddressFromForm();

    this.confirmationPopupService.confirm(() => {
      this.isNewSupplier ? this.addSupplier(this.supplier) : this.updateExistingSupplier(this.supplier);
    });
  }

  private buildAddressFromForm(): Address | null {
    if (this.addressForm && this.addressForm.addressForm && this.addressForm.addressForm.valid) {
      return this.addressForm.getAddressValues();
    }
    return null;
  }

  private addSupplier(supplier: Supplier): void {
    this.supplierService.addSupplier(supplier).subscribe(newSupplier => {
      this.navigateToSupplierDetails();
    });
  }

  private updateExistingSupplier(supplier: Supplier): void {
    this.supplierService.updateSupplier(supplier.id, supplier).subscribe(() => {
      this.navigateToSupplierDetails();
    });
  }

  navigateToSupplierDetails(): void {
    if (this.supplier && this.supplier.id) {
      this.router.navigate(['/', 'supplier', 'details', this.supplierId]);
    }
  }

  navigateToSupplierList(): void {
    this.router.navigate(['/', 'supplier', 'list']);
  }

  goBack(): void {
    this.isNewSupplier ? this.navigateToSupplierList() : this.navigateToSupplierDetails();
  }
}
