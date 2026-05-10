import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { LocationService } from './location.service';
import { LoadingService } from '../core/services/loading.service';
import { Observable } from 'rxjs';
import { Country, Division, District, Upazila, PostCode, SelectedAddress, InitialAddress } from './location.model';

import { ConfirmationService } from '../confirmation-popup/confirmation.service';
import { ShowEntriesService } from '../show-entries/show-entries.service';

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

  ngOnInit(): void {
    this.prepareForm(null);
    this.loadCountries();
    this.onCountryChange();
    this.onDivisionChange();
    this.onDistrictChange();
    this.onUpazilaChange();
  }

  private loadCountries(): void {
    this.countryError = '';

    this.locationService.getCountries().subscribe({
      next: countries => {
        this.countries = countries;
        /*
          Since my database has only one country,
          I can auto-select it.
        */
        if (countries.length === 1) {
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
      post_code: selectedPostCode ? selectedPostCode.postCode : null
    };

    console.log('Selected Address from child-component:', selectedAddress);

    this.showEntriesService.postEntry(selectedAddress).subscribe(() => {
      console.log('Entry added successfully!');
    }, error => {
      console.error('Error adding entry:', error);
    });
    // Emit to parent component
    this.addressSubmit.emit(selectedAddress);
  }
}