export interface Country {
  id: number;
  name: string;
  code: string;
}

export interface Division {
  id: number;
  country_id: number;
  name: string;
  bn_name: string;
  lat?: string;
  lng?: string;
}

export interface District {
  id: number;
  division_id: number;
  name: string;
  bn_name: string;
  lat?: string;
  lng?: string;
}

export interface Upazila {
  id: number;
  district_id: number;
  name: string;
  bn_name: string;
}

export interface PostCode {
  id?: number;
  upazila_id: number;
  postOffice: string;
  postCode: string;
}

export interface SelectedAddress {
  country_name: string | null;
  division_name: string | null;
  district_name: string | null;
  upazila_name: string | null;
  post_offce_name: string | null;
  post_code: string | null;
}

export class InitialAddress {
  countryId?: number | null;
  divisionId?: number | null;
  districtId?: number | null;
  upazilaId?: number | null;
  postOffice?: string | null;
  postCode?: string | null;
}