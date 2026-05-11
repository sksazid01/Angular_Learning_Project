import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { LocationService } from './location.service';
import { LoadingService } from '../core/services/loading.service';
import { Observable } from 'rxjs';
import { Country, Division, District, Upazila, PostCode, SelectedAddress, InitialAddress } from './location.model';

import { ConfirmationService } from '../confirmation-popup/confirmation.service';
import { ShowEntriesService } from '../show-entries/address.service';

@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.css']
})
export class LocationSelectorComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private loadingService: LoadingService, 
    private confirmationService: ConfirmationService,
    private showEntriesService: ShowEntriesService
  ) { }

  @Output() addressSubmit = new EventEmitter<SelectedAddress>(); // for transmitting address data to parent component

  countries: Country[] = [];
  divisions: Division[] = [];
  districts: District[] = [];
  upazilas: Upazila[] = [];
  postCodes: PostCode[] = [];
  countryError = '';
  divisionError = '';
  districtError = '';
  upazilaError = '';
  postCodeError = '';

  locationForm!: FormGroup;

  prepareForm(formData: InitialAddress): void {
    formData = formData || new InitialAddress();

    this.locationForm = this.fb.group({
      countryId: [formData.countryId, Validators.required],
      divisionId: [formData.divisionId, Validators.required],
      districtId: [formData.districtId, Validators.required],
      upazilaId: [formData.upazilaId, Validators.required],
      postCode: [formData.postCode, Validators.required]
    });
  }

  isEditMode = false;
  editingEntryId: number | null = null;

  ngOnInit(): void {
    this.prepareForm(null);
    this.loadCountries();
    this.onCountryChange();
    this.onDivisionChange();
    this.onDistrictChange();
    this.onUpazilaChange();
  }

  public async startEdit(entry: SelectedAddress): Promise<void> {
    if (entry) {
      this.isEditMode = true;
      this.editingEntryId = entry.id!;
      await this.populateForm(entry);
    }
  }

  private async populateForm(entry: SelectedAddress): Promise<void> {
    if (entry) {
        this.isEditMode = true;
        this.editingEntryId = entry.id!;
      } 
    else {
      this.isEditMode = false;
      this.editingEntryId = null;
      if (this.locationForm) {
          this.locationForm.reset();
          if (this.countries.length === 1) {
            this.locationForm.patchValue({ countryId: this.countries[0].id });
          }
      }
      return;
      }

    const country = this.countries.find(c => c.name === entry.country_name);
    const countryId = country ? country.id : 1; 

    try {
      // lists required to populate the dropdowns using (entry.*_id) fields. 
      this.divisions = await this.locationService.getDivisions().toPromise();
      
      if (entry.division_id) {
        this.districts = await this.locationService.getDistrictsByDivision(entry.division_id).toPromise();
      }
      
      if (entry.district_id) {
        this.upazilas = await this.locationService.getUpazilasByDistrict(entry.district_id).toPromise();
      }
      
      if (entry.upazila_id) {
        this.postCodes = await this.locationService.getPostCodesByUpazila(entry.upazila_id).toPromise();
      }

      // Update existing form with absolute IDs instead of names
      this.locationForm.patchValue({ 
        countryId: countryId, 
        divisionId: entry.division_id, 
        districtId: entry.district_id, 
        upazilaId: entry.upazila_id, 
        postCode: entry.post_code 
      }, { emitEvent: false });
      
      // Ensure all filled controls are enabled so user can edit them
      if (countryId) this.locationForm.get('countryId').enable({ emitEvent: false });
      if (entry.division_id) this.locationForm.get('divisionId').enable({ emitEvent: false });
      if (entry.district_id) this.locationForm.get('districtId').enable({ emitEvent: false });
      if (entry.upazila_id) this.locationForm.get('upazilaId').enable({ emitEvent: false });
      if (entry.post_code) this.locationForm.get('postCode').enable({ emitEvent: false });

    } catch (error) {
      console.error('Failed to populate edit data:', error);
    }
  }

  private loadCountries(): void {
    this.countryError = '';

    this.locationService.getCountries().subscribe({
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
    this.locationForm.get('countryId').valueChanges.subscribe(countryId => {
      this.resetFromCountry();

      if (!countryId) {
        return;
      }

      this.locationForm.get('divisionId').enable();
      this.loadDivisions();
    });
  }

  private loadDivisions(): void {
    this.divisionError = '';

    this.locationService.getDivisions().subscribe({
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
    this.locationForm.get('divisionId').valueChanges.subscribe(divisionId => {
      this.resetFromDivision();

      if (!divisionId) {
        return;
      }

      this.locationForm.get('districtId').enable();
      this.districtError = '';

      this.locationService.getDistrictsByDivision(divisionId).subscribe({
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
    this.locationForm.get('districtId').valueChanges.subscribe(districtId => {
      this.resetFromDistrict();

      if (!districtId) {
        return;
      }

      this.locationForm.get('upazilaId').enable();
      this.upazilaError = '';

      this.locationService.getUpazilasByDistrict(districtId).subscribe({
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
    this.locationForm.get('upazilaId').valueChanges.subscribe(upazilaId => {
      this.resetFromUpazila();

      if (!upazilaId) {
        return;
      }

      this.locationForm.get('postCode').enable();
      this.postCodeError = '';

      this.locationService.getPostCodesByUpazila(upazilaId).subscribe({
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

    this.locationForm.get('divisionId').disable();
    this.locationForm.get('districtId').disable();
    this.locationForm.get('upazilaId').disable();
    this.locationForm.get('postCode').disable();
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

    this.locationForm.get('districtId').disable();
    this.locationForm.get('upazilaId').disable();
    this.locationForm.get('postCode').disable();
  }

  private resetFromDistrict(): void {
    this.locationForm.patchValue({
      upazilaId: null,
      postCode: ''
    }, { emitEvent: false });

    this.upazilas = [];
    this.postCodes = [];

    this.locationForm.get('upazilaId').disable();
    this.locationForm.get('postCode').disable();
  }

  private resetFromUpazila(): void {
    this.locationForm.patchValue({
      postCode: ''
    }, { emitEvent: false });

    this.postCodes = [];

    this.locationForm.get('postCode').disable();
  }


  onSubmitRequest(): void {
    if (this.locationForm.invalid) {
      console.log('Form is invalid! Fields missing.');
      Object.values(this.locationForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    console.log('Form valid, showing popup...');
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
      
      division_id: selectedDivision ? selectedDivision.id : null,
      district_id: selectedDistrict ? selectedDistrict.id : null,
      upazila_id: selectedUpazila ? selectedUpazila.id : null,
      post_office_id: selectedPostCode && selectedPostCode.id ? selectedPostCode.id : null
    };
    
    if (this.isEditMode && this.editingEntryId) {
      selectedAddress.id = this.editingEntryId;
      this.showEntriesService.updateEntry(this.editingEntryId, selectedAddress).subscribe(() => {
        console.log('Entry updated successfully!');
        this.resetEditMode(); // Reset after edit
      }, error => {
        console.error('Error updating entry:', error);
      });
    } else {
      this.showEntriesService.postEntry(selectedAddress).subscribe(() => {
        console.log('Entry added successfully!');
        this.resetEditMode();
      }, error => {
        console.error('Error adding entry:', error);
      });
    }
    // Emit to parent component
    this.addressSubmit.emit(selectedAddress);
  }

  private resetEditMode(): void {
    this.isEditMode = false;
    this.editingEntryId = null;
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