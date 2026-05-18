import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { AddressFormService } from './address-form.service';
import { Country, Division, District, Upazila, PostOffice, Address } from './address-form.model';
import { ConfirmationPopupService } from '../confirmation-popup/confirmation-popup.service';
import { AddressListService } from '../address-lists/address-lists.service';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit, OnChanges {
  @Input() address?: Address;
  @Input() standalone: boolean = true; // when true, this component handles creating/updating addresses itself

  public countries: Country[] = [];
  public divisions: Division[] = [];
  public districts: District[] = [];
  public upazilas: Upazila[] = [];
  public postOffice: PostOffice[] = [];

  public isEditMode = false;
  public addressForm!: FormGroup;
  private currentAddressIdForEditing: number | null = null; // remove

  constructor(
    private formBuilder: FormBuilder,
    private addressFormService: AddressFormService,
    private confirmationPopupService: ConfirmationPopupService,
    private addressListService: AddressListService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadCountries();
    this.loadDivisions();
    this.onCountryChange();
    this.onDivisionChange();
    this.onDistrictChange();
    this.onUpazilaChange();

    this.addressFormService.editAddress$.subscribe(address => {
      this.startEdit(address);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address']) {
      const address = changes['address'].currentValue;
      if (address && this.addressForm) {
        this.startEdit(address);
      } else if (!address && this.addressForm) {
        this.isEditMode = false;
        this.addressForm.reset();
      }
    }
  }

  // =========================
  // Form Initialization
  // =========================
  private buildForm(formData?: Address | null): void {
    const data = formData || new Address();
    this.addressForm = this.formBuilder.group({
      countryId: [1, Validators.required],
      divisionId: [data.division ? data.division.id : null, Validators.required],
      districtId: [data.district ? data.district.id : null, Validators.required],
      upazilaId: [data.upazila ? data.upazila.id : null, Validators.required],
      postCode: [data.postOffice ? data.postOffice.postCode : null, Validators.required]
    });
  }

  // =========================
  // Public UI Methods
  // =========================
  public onSubmitRequest(): void {
    if (this.addressForm.invalid) {
      this.showLoadError('Please fill all required fields correctly before submitting.');
      Object.values(this.addressForm.controls).forEach(control => control.markAsTouched());
      return;
    }
    this.confirmationPopupService.confirm(() => this.submit());
  }

  public startEdit(address: Address): void {
    if (address) {
      if (address.id) {
        this.enableEditMode(address.id);
      } else {
        this.isEditMode = true;
      }
      this.loadAddressForEdit(address);
    }
  }

  // =========================
  // Edit Mode Helpers
  // =========================
  private enableEditMode(addressId: number): void {
    this.isEditMode = true;
    this.currentAddressIdForEditing = addressId;
  }

  private disableEditMode(): void {
    this.isEditMode = false;
    this.currentAddressIdForEditing = null;
  }

  // =========================
  // Form Population
  // =========================
  private loadAddressForEdit(address: Address): void {
    try {
      this.loadRelatedAddresssForOptionsPreview(address);
      this.patchAddressValues(address);
    } catch (error) {
      this.showLoadError('Failed to load address data for editing. Please try again.');
    }
  }

  private loadRelatedAddresssForOptionsPreview(address: Address): void {
    this.addressFormService.getCountries().subscribe((countries: Country[]) => {
      this.countries = countries;
    });

    this.addressFormService.getDivisions().subscribe((divisions: Division[]) => {
      this.divisions = divisions;
    });

    if (address.division && address.division.id) {
      this.addressFormService.getDistrictsByDivision(address.division.id).subscribe((districts: District[]) => {
        this.districts = districts;
      });
    }

    if (address.district && address.district.id) {
      this.addressFormService.getUpazilasByDistrict(address.district.id).subscribe((upazilas: Upazila[]) => {
        this.upazilas = upazilas;
      });
    }

    if (address.upazila && address.upazila.id) {
      this.addressFormService.getPostCodesByUpazila(address.upazila.id).subscribe((postOffice: PostOffice[]) => {
        this.postOffice = postOffice;
      });
    }
  }

  // =========================
  // Update the form values instead of reload the whole form
  // =========================
  private patchAddressValues(address: Address): void {
    this.addressForm.patchValue({
      countryId: 1,
      divisionId: address.division ? address.division.id : null,
      districtId: address.district ? address.district.id : null,
      upazilaId: address.upazila ? address.upazila.id : null,
      postCode: address.postOffice ? address.postOffice.postCode : null
    }, { emitEvent: false });
  }

  // =========================
  // Dropdown Change Handlers
  // =========================
  private onCountryChange(): void {
    this.getControl('countryId').valueChanges.subscribe(countryId => {
      this.resetFromCountry();
      this.loadDivisions();
    });
  }

  private onDivisionChange(): void {
    this.getControl('divisionId').valueChanges.subscribe(divisionId => {
      this.resetFromDivision();
      if (divisionId) {
        this.loadDistricts(divisionId);
      }
    });
  }

  private onDistrictChange(): void {
    this.getControl('districtId').valueChanges.subscribe(districtId => {
      this.resetFromDistrict();
      if (districtId) {
        this.loadUpazilas(districtId);
      }
    });
  }

  private onUpazilaChange(): void {
    this.getControl('upazilaId').valueChanges.subscribe(upazilaId => {
      this.resetFromUpazila();
      if (upazilaId) {
        this.loadPostCodes(upazilaId);
      }
    });
  }

  // =========================
  // Data Loaders
  // =========================
  private loadCountries(): void {
    this.addressFormService.getCountries().subscribe({
      next: countries => {
        this.countries = countries;
      },
      error: error => {
        this.showLoadError('Failed to load countries. Please try again.');
      }
    });
  }

  private loadDivisions(): void {
    this.addressFormService.getDivisions().subscribe({
      next: divisions => {
        this.divisions = divisions;
      },
      error: error => {
        this.showLoadError('Failed to load divisions. Please try again.');
      }
    });
  }

  private loadDistricts(divisionId: number): void {
    this.addressFormService.getDistrictsByDivision(divisionId).subscribe({
      next: districts => {
        this.districts = districts;
      },
      error: error => {
        this.showLoadError('Failed to load districts. Please try again.');
      }
    });
  }

  private loadUpazilas(districtId: number): void {
    this.addressFormService.getUpazilasByDistrict(districtId).subscribe({
      next: upazilas => {
        this.upazilas = upazilas;
      },
      error: error => {
        this.showLoadError('Failed to load upazilas. Please try again.');
      }
    });
  }

  private loadPostCodes(upazilaId: number): void {
    this.addressFormService.getPostCodesByUpazila(upazilaId).subscribe({
      next: postOffice => {
        this.postOffice = postOffice;
      },
      error: error => {
        this.showLoadError('Failed to load post codes. Please try again.');
      }
    });
  }

  // =========================
  // Reset Helpers
  // =========================
  private clearDependencies(
    fieldsToReset: { [key: string]: any },
    arraysToClear: string[]
  ): void {
    this.addressForm.patchValue(fieldsToReset, { emitEvent: false });

    // Using simple approach to clear arrays
    if (arraysToClear.includes('divisions')) this.divisions = [];
    if (arraysToClear.includes('districts')) this.districts = [];
    if (arraysToClear.includes('upazilas')) this.upazilas = [];
    if (arraysToClear.includes('postOffice')) this.postOffice = [];
  }

  private resetFromCountry(): void {
    this.clearDependencies(
      { divisionId: null, districtId: null, upazilaId: null, postCode: null },
      ['divisions', 'districts', 'upazilas', 'postOffice']
    );
  }

  private resetFromDivision(): void {
    this.clearDependencies(
      { districtId: null, upazilaId: null, postCode: null },
      ['districts', 'upazilas', 'postOffice']
    );
  }

  private resetFromDistrict(): void {
    this.clearDependencies(
      { upazilaId: null, postCode: null },
      ['upazilas', 'postOffice']
    );
  }

  private resetFromUpazila(): void {
    this.clearDependencies(
      { postCode: null },
      ['postOffice']
    );
  }

  // =========================
  // Submit Workflow
  // =========================
  public submit(): void {
    const address = this.buildAddressForSubmit();

    if (this.isEditMode && this.currentAddressIdForEditing) {
      address.id = this.currentAddressIdForEditing;
      if (this.standalone) {
        this.updateAddress(address);
      } else {
        // when embedded in supplier-info-update, do not create/update address here
        this.addressFormService.onAddressFormSubmit();
      }
      this.disableEditMode();
    } else {
      if (this.standalone) {
        this.createAddress(address);
      } else {
        this.addressFormService.onAddressFormSubmit();
      }
    }
    this.resetFromCountry();
  }

  // Public helper for parent components to get the Address object without creating it
  public getAddressFromAddressForm(): Address {
    return this.buildAddressForSubmit();
  }

  private buildAddressForSubmit(): Address {
    const formValue = this.addressForm.getRawValue();

    const selectedCountry = this.countries.find(item => item.id === formValue.countryId);
    const selectedDivision = this.divisions.find(item => item.id === formValue.divisionId);
    const selectedDistrict = this.districts.find(item => item.id === formValue.districtId);
    const selectedUpazila = this.upazilas.find(item => item.id === formValue.upazilaId);
    const selectedPostCode = this.postOffice.find(item => item.postCode === formValue.postCode);

    return {
      country: selectedCountry ? selectedCountry : null,
      division: selectedDivision ? selectedDivision : null,
      district: selectedDistrict ? selectedDistrict : null,
      upazila: selectedUpazila ? selectedUpazila : null,
      postOffice: selectedPostCode ? selectedPostCode : null,
    };
  }

  private createAddress(address: Address): void {
    this.addressListService.addAddress(address).subscribe({
      next: () => {
        this.showLoadError('Address added successfully!', false);
        this.addressFormService.onAddressFormSubmit();
      },
      error: error => {
        this.showLoadError('Failed to add address. Please try again.');
      }
    });
  }

  private updateAddress(address: Address): void {
    if (!this.currentAddressIdForEditing) return;

    this.addressListService.updateAddress(this.currentAddressIdForEditing, address).subscribe({
      next: () => {
        this.showLoadError('Address updated successfully!', false);
        this.addressFormService.onAddressFormSubmit();
      },
      error: error => {
        this.showLoadError('Failed to update address. Please try again.');
      }
    });
  }

  // =========================
  // Returns the form control object through the control name
  // =========================
  private getControl(controlName: string): AbstractControl {
    const control = this.addressForm.get(controlName);
    if (!control) {
      this.showLoadError(`Control ${controlName} not found in form`);
      throw new Error(`Control ${controlName} not found in form`);
    }
    return control;
  }

  // =========================
  // Error Handling
  // =========================
  private showLoadError(message: string, isError: boolean = true): void {
    this.notificationService.showNotification(message, isError);
  }
}
