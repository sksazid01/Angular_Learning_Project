import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LocationFormService } from './location-form.service';
import { Country, Division, District, Upazila, PostCode, SelectedAddress, InitialAddress } from './location-form.model';
import { ConfirmationService } from '../confirmation-popup/confirmation.service';
import { LocationListService } from '../location-lists/location-lists.service';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.css']
})
export class AddressFormComponent implements OnInit {
  countryError = '';
  divisionError = '';
  districtError = '';
  upazilaError = '';
  postCodeError = '';

  countries: Country[] = [];
  divisions: Division[] = [];
  districts: District[] = [];
  upazilas: Upazila[] = [];
  postCodes: PostCode[] = [];

  isEditMode = false;
  locationForm!: FormGroup;
  editingAddressId: number | null = null;
  pendingSelectedAddress: SelectedAddress | null = null;

  @Input() selectedAddress: SelectedAddress | null = null;
  @Output() addressSubmit = new EventEmitter<SelectedAddress>(); // for transmitting address data to parent component

  constructor(
    private formBuilder: FormBuilder,
    private locationFormService: LocationFormService,
    private confirmationService: ConfirmationService,
    private locationListService: LocationListService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.prepareForm(null);
    this.loadCountries();
    this.onCountryChange();
    this.onDivisionChange();
    this.onDistrictChange();
    this.onUpazilaChange();

    if (this.pendingSelectedAddress) {
      this.startEdit(this.pendingSelectedAddress);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedAddress']) {
      const address = changes['selectedAddress'].currentValue;
      this.pendingSelectedAddress = address;
      if (address && this.locationForm) this.startEdit(address);
    }
  }



  prepareForm(formData: InitialAddress | null): void {
    formData = formData || new InitialAddress();

    this.locationForm = this.formBuilder.group({
      countryId: [formData.countryId, Validators.required],
      divisionId: [formData.divisionId, Validators.required],
      districtId: [formData.districtId, Validators.required],
      upazilaId: [formData.upazilaId, Validators.required],
      postCode: [formData.postCode, Validators.required]
    });
  }

  private turnOnEditMode(): void {
    this.isEditMode = true;
  }

  private turnOffEditMode(): void {
    this.isEditMode = false;
    this.editingAddressId = null;
  }

  public async startEdit(address: SelectedAddress): Promise<void> {
    if (address) {
      this.turnOnEditMode();
      this.editingAddressId = address.id!;
      await this.populateForm(address);
    }
  }

  private async populateForm(address: SelectedAddress): Promise<void> {
    const country = this.countries.find(c => c.name === address.country_name);
    const countryId = country ? country.id : 1;

    if (address) {
      this.turnOffEditMode();
      this.editingAddressId = address.id!;
    }
    else {
      this.turnOffEditMode();
      if (this.locationForm) {
        this.locationForm.reset();
        if (this.countries.length === 1) {
          this.locationForm.patchValue({ countryId: this.countries[0].id });
        }
      }
      return;
    }

    try {
      // lists required to populate the dropdowns using (address.*_id) fields. 
      this.divisions = await this.locationFormService.getDivisions().toPromise();

      if (address.division_id) {
        this.districts = await this.locationFormService.getDistrictsByDivision(address.division_id).toPromise();
      }

      if (address.district_id) {
        this.upazilas = await this.locationFormService.getUpazilasByDistrict(address.district_id).toPromise();
      }

      if (address.upazila_id) {
        this.postCodes = await this.locationFormService.getPostCodesByUpazila(address.upazila_id).toPromise();
      }

      // Update existing form with absolute IDs instead of names
      this.locationForm.patchValue({
        countryId: countryId,
        divisionId: address.division_id,
        districtId: address.district_id,
        upazilaId: address.upazila_id,
        postCode: address.post_code
      }, { emitEvent: false });

      // Ensure all filled controls are enabled so user can edit them
      if (countryId) this.locationForm.get('countryId')!.enable({ emitEvent: false });
      if (address.division_id) this.locationForm.get('divisionId')!.enable({ emitEvent: false });
      if (address.district_id) this.locationForm.get('districtId')!.enable({ emitEvent: false });
      if (address.upazila_id) this.locationForm.get('upazilaId')!.enable({ emitEvent: false });
      if (address.post_code) this.locationForm.get('postCode')!.enable({ emitEvent: false });

    } catch (error) {
      console.error('Failed to populate edit data:', error);
    }
  }

  private loadCountries(): void {
    this.countryError = '';

    this.locationFormService.getCountries().subscribe({
      next: countries => {
        this.countries = countries;

        if (countries.length === 1 && !this.isEditMode) {
          this.locationForm.patchValue({
            countryId: countries[0].id
          });
        }
      },
      error: error => {
        console.error(error);
        this.countryError = 'Could not load countries.';
      }
    });
  }

  private onCountryChange(): void {
    this.locationForm.get('countryId')!.valueChanges.subscribe(countryId => {
      this.resetFromCountry();

      if (!countryId) {
        return;
      }

      this.locationForm.get('divisionId')!.enable();
      this.loadDivisions();
    });
  }

  private loadDivisions(): void {
    this.divisionError = '';

    this.locationFormService.getDivisions().subscribe({
      next: divisions => {
        this.divisions = divisions;
      },
      error: error => {
        console.error(error);
        this.divisionError = 'Could not load divisions.';
      }
    });
  }

  private onDivisionChange(): void {
    this.locationForm.get('divisionId')!.valueChanges.subscribe(divisionId => {
      this.resetFromDivision();

      if (!divisionId) {
        return;
      }

      this.locationForm.get('districtId')!.enable();
      this.districtError = '';

      this.locationFormService.getDistrictsByDivision(divisionId).subscribe({
        next: districts => {
          this.districts = districts;
        },
        error: error => {
          console.error(error);
          this.districtError = 'Could not load districts.';
        }
      });
    });
  }

  private onDistrictChange(): void {
    this.locationForm.get('districtId')!.valueChanges.subscribe(districtId => {
      this.resetFromDistrict();

      if (!districtId) {
        return;
      }

      this.locationForm.get('upazilaId')!.enable();
      this.upazilaError = '';

      this.locationFormService.getUpazilasByDistrict(districtId).subscribe({
        next: upazilas => {
          this.upazilas = upazilas;
        },
        error: error => {
          console.error(error);
          this.upazilaError = 'Could not load upazilas.';
        }
      });
    });
  }

  private onUpazilaChange(): void {
    this.locationForm.get('upazilaId')!.valueChanges.subscribe(upazilaId => {
      this.resetFromUpazila();

      if (!upazilaId) {
        return;
      }

      this.locationForm.get('postCode')!.enable();
      this.postCodeError = '';

      this.locationFormService.getPostCodesByUpazila(upazilaId).subscribe({
        next: postCodes => {
          this.postCodes = postCodes;
        },
        error: error => {
          console.error(error);
          this.postCodeError = 'Could not load post offices.';
        }
      });
    });
  }

  private resetFromCountry(): void {
    this.locationForm.patchValue({
      divisionId: null,
      districtId: null,
      upazilaId: null,
      postCode: ''
    }, { emitEvent: false });

    this.divisions = [];
    this.districts = [];
    this.upazilas = [];
    this.postCodes = [];

    this.locationForm.get('divisionId')!.disable();
    this.locationForm.get('districtId')!.disable();
    this.locationForm.get('upazilaId')!.disable();
    this.locationForm.get('postCode')!.disable();
  }

  private resetFromDivision(): void {
    this.locationForm.patchValue({
      districtId: null,
      upazilaId: null,
      postCode: ''
    }, { emitEvent: false });

    this.districts = [];
    this.upazilas = [];
    this.postCodes = [];

    this.locationForm.get('districtId')!.disable();
    this.locationForm.get('upazilaId')!.disable();
    this.locationForm.get('postCode')!.disable();
  }

  private resetFromDistrict(): void {
    this.locationForm.patchValue({
      upazilaId: null,
      postCode: ''
    }, { emitEvent: false });

    this.upazilas = [];
    this.postCodes = [];

    this.locationForm.get('upazilaId')!.disable();
    this.locationForm.get('postCode')!.disable();
  }

  private resetFromUpazila(): void {
    this.locationForm.patchValue({
      postCode: ''
    }, { emitEvent: false });

    this.postCodes = [];
    this.locationForm.get('postCode')!.disable();
  }


  onSubmitRequest(): void {
    if (this.locationForm.invalid) {
      console.log('Form is invalid! Fields missing.');
      Object.values(this.locationForm.controls).forEach(control => control.markAsTouched());
      return;
    }
    this.confirmationService.confirm(() => this.submit());
  }


  submit(): void {
    const formValue = this.locationForm.getRawValue();

    const selectedCountry = this.countries.find(
      item => item.id === formValue.countryId
    );

    const selectedDivision = this.divisions.find(
      item => item.id === formValue.divisionId
    );

    const selectedDistrict = this.districts.find(
      item => item.id === formValue.districtId
    );

    const selectedUpazila = this.upazilas.find(
      item => item.id === formValue.upazilaId
    );

    const selectedPostCode = this.postCodes.find(
      item => item.postCode === formValue.postCode
    );

    const selectedAddress: SelectedAddress = {
      country_name: selectedCountry ? selectedCountry.name : null,
      division_name: selectedDivision ? selectedDivision.name : null,
      district_name: selectedDistrict ? selectedDistrict.name : null,
      upazila_name: selectedUpazila ? selectedUpazila.name : null,
      post_offce_name: selectedPostCode ? selectedPostCode.postOffice : null,
      post_code: selectedPostCode ? selectedPostCode.postCode : null,
      post_office_id: selectedPostCode && selectedPostCode.id ? selectedPostCode.id : null,
      division_id: selectedDivision ? selectedDivision.id : null,
      district_id: selectedDistrict ? selectedDistrict.id : null,
      upazila_id: selectedUpazila ? selectedUpazila.id : null
    };

    if (this.isEditMode && this.editingAddressId) {
      selectedAddress.id = this.editingAddressId;
      this.locationListService.updateAddress(this.editingAddressId, selectedAddress).subscribe(() => {
        this.notificationService.showNotification('Address updated successfully!');
        this.resetEditMode(); // Reset after edit
        this.addressSubmit.emit(selectedAddress);
      }, error => {
        this.notificationService.showNotification('Failed to update address. Please try again.', true);
        console.error('Error updating address:', error);
      });
    } else {
      this.locationListService.addAddress(selectedAddress).subscribe(() => {
        this.notificationService.showNotification('Address added successfully!', false);
        console.log('Address added successfully!');
        this.resetEditMode();
        this.addressSubmit.emit(selectedAddress);
      }, error => {
        this.notificationService.showNotification('Failed to add address. Please try again.', true);
        console.error('Error adding address:', error);
      });
    }
  }

  private resetEditMode(): void {
    this.turnOffEditMode();
    if (this.locationForm) {
      this.locationForm.reset();
      if (this.countries.length === 1) {
        this.locationForm.patchValue({ countryId: this.countries[0].id }, { emitEvent: false });
        const divCtrl = this.locationForm.get('divisionId');
        if (divCtrl) {
          divCtrl.enable({ emitEvent: false });
        }
        this.loadDivisions();
      }
    }
  }
}
