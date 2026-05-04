import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { LocationService } from './location.service';
import { Country, Division, District, Upazila, PostCode } from './location.model';

@Component({
  selector: 'app-location-selector',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './location-selector.component.html',
  styleUrl: './location-selector.component.css'
})
export class LocationSelectorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private locationService = inject(LocationService);

  countries: Country[] = [];
  divisions: Division[] = [];
  districts: District[] = [];
  upazilas: Upazila[] = [];
  postCodes: PostCode[] = [];

  loadingCountries = false;
  loadingDivisions = false;
  loadingDistricts = false;
  loadingUpazilas = false;
  loadingPostCodes = false;

  countryError = '';
  divisionError = '';
  districtError = '';
  upazilaError = '';
  postCodeError = '';

  locationForm = this.fb.group({
    countryId: [null as number | null, Validators.required],
    divisionId: [{ value: null as number | null, disabled: true }, Validators.required],
    districtId: [{ value: null as number | null, disabled: true }, Validators.required],
    upazilaId: [{ value: null as number | null, disabled: true }, Validators.required],
    postCode: [{ value: '', disabled: true }, Validators.required]
  });
  
  ngOnInit(): void {
    this.loadCountries();

    this.onCountryChange();
    this.onDivisionChange();
    this.onDistrictChange();
    this.onUpazilaChange();
  }

  private loadCountries(): void {
    this.loadingCountries = true;
    this.countryError = '';

    this.locationService.getCountries().subscribe({
      next: countries => {
        this.countries = countries;
        this.loadingCountries = false;

        /*
          Since your database has only one country,
          you can auto-select it.
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
        this.loadingCountries = false;
      }
    });
  }

  private onCountryChange(): void {
    this.locationForm.get('countryId')?.valueChanges.subscribe(countryId => {
      this.resetFromCountry();

      if (!countryId) {
        return;
      }

      this.locationForm.get('divisionId')?.enable();
      this.loadDivisions();
    });
  }

  private loadDivisions(): void {
    this.loadingDivisions = true;
    this.divisionError = '';

    this.locationService.getDivisions().subscribe({
      next: divisions => {
        this.divisions = divisions;
        this.loadingDivisions = false;
      },
      error: error => {
        console.error(error);
        this.divisionError = 'Could not load divisions.';
        this.loadingDivisions = false;
      }
    });
  }

  private onDivisionChange(): void {
    this.locationForm.get('divisionId')?.valueChanges.subscribe(divisionId => {
      this.resetFromDivision();

      if (!divisionId) {
        return;
      }

      this.locationForm.get('districtId')?.enable();
      this.loadingDistricts = true;
      this.districtError = '';

      this.locationService.getDistrictsByDivision(divisionId).subscribe({
        next: districts => {
          this.districts = districts;
          this.loadingDistricts = false;
        },
        error: error => {
          console.error(error);
          this.districtError = 'Could not load districts.';
          this.loadingDistricts = false;
        }
      });
    });
  }

  private onDistrictChange(): void {
    this.locationForm.get('districtId')?.valueChanges.subscribe(districtId => {
      this.resetFromDistrict();

      if (!districtId) {
        return;
      }

      this.locationForm.get('upazilaId')?.enable();
      this.loadingUpazilas = true;
      this.upazilaError = '';

      this.locationService.getUpazilasByDistrict(districtId).subscribe({
        next: upazilas => {
          this.upazilas = upazilas;
          this.loadingUpazilas = false;
        },
        error: error => {
          console.error(error);
          this.upazilaError = 'Could not load upazilas.';
          this.loadingUpazilas = false;
        }
      });
    });
  }

  private onUpazilaChange(): void {
    this.locationForm.get('upazilaId')?.valueChanges.subscribe(upazilaId => {
      this.resetFromUpazila();

      if (!upazilaId) {
        return;
      }

      this.locationForm.get('postCode')?.enable();
      this.loadingPostCodes = true;
      this.postCodeError = '';

      this.locationService.getPostCodesByUpazila(upazilaId).subscribe({
        next: postCodes => {
          this.postCodes = postCodes;
          this.loadingPostCodes = false;
        },
        error: error => {
          console.error(error);
          this.postCodeError = 'Could not load post offices.';
          this.loadingPostCodes = false;
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

    this.locationForm.get('divisionId')?.disable();
    this.locationForm.get('districtId')?.disable();
    this.locationForm.get('upazilaId')?.disable();
    this.locationForm.get('postCode')?.disable();
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

    this.locationForm.get('districtId')?.disable();
    this.locationForm.get('upazilaId')?.disable();
    this.locationForm.get('postCode')?.disable();
  }

  private resetFromDistrict(): void {
    this.locationForm.patchValue({
      upazilaId: null,
      postCode: ''
    }, { emitEvent: false });

    this.upazilas = [];
    this.postCodes = [];

    this.locationForm.get('upazilaId')?.disable();
    this.locationForm.get('postCode')?.disable();
  }

  private resetFromUpazila(): void {
    this.locationForm.patchValue({
      postCode: ''
    }, { emitEvent: false });

    this.postCodes = [];

    this.locationForm.get('postCode')?.disable();
  }

  submit(): void {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }

    const formValue = this.locationForm.getRawValue();

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

    const selectedAddress = {
      countryId: formValue.countryId,
      countryName: this.countries.find(item => item.id === formValue.countryId)?.name,

      divisionId: formValue.divisionId,
      divisionName: selectedDivision?.name,

      districtId: formValue.districtId,
      districtName: selectedDistrict?.name,

      upazilaId: formValue.upazilaId,
      upazilaName: selectedUpazila?.name,

      postOffice: selectedPostCode?.postOffice,
      postCode: selectedPostCode?.postCode
    };

    console.log('Selected Address:', selectedAddress);
  }
}