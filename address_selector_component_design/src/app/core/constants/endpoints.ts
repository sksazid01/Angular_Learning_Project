export const ENDPOINTS = {
  address: {
    countries: '/countries',
    divisions: '/divisions',
    districts: '/districts',
    upazilas: '/upazilas',
    postOffice: '/postoffice'
  },
  suppliers: {
    list: '/suppliers',
    byId: (id: number) => `/suppliers/${id}`
  }
};