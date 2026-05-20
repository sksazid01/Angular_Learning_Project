export const ENDPOINTS = {
  address: {
    countries: '/countries',
    divisions: '/divisions',
    districts: '/districts',
    upazilas: '/upazilas',
    postOffice: '/postoffice'
  },
  suppliers: {
    list: '/supplier_list',
    byId: (id: number) => `/supplier_list/${id}`
  }
};