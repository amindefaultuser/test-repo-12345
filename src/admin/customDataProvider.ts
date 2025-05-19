
import { fetchUtils } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const apiUrl = 'https://selewanto.onrender.com/api';
const httpClient = fetchUtils.fetchJson;


const dataProvider = jsonServerProvider(apiUrl, httpClient);


const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }
    return {};
};

// Створюємо захищений dataProvider
const authenticatedDataProvider = {
  ...dataProvider,

  getList: (resource: string, params: any) => {
    const headers = getAuthHeaders();
    return dataProvider.getList(resource, {
      ...params,
      options: {
        headers, 
      },
    });
  },

  getOne: (resource: string, params: any) => {
    const headers = getAuthHeaders();
    return dataProvider.getOne(resource, {
      ...params,
      options: { headers },
    });
  },

  getMany: (resource: string, params: any) => {
    const headers = getAuthHeaders();
    return dataProvider.getMany(resource, {
      ...params,
      options: { headers },
    });
  },

  getManyReference: (resource: string, params: any) => {
    const headers = getAuthHeaders();
    return dataProvider.getManyReference(resource, {
      ...params,
      options: { headers },
    });
  },

  create: (resource: string, params: any) => {
    const headers = getAuthHeaders();
    return dataProvider.create(resource, {
      ...params,
      options: { headers },
    });
  },

  update: (resource: string, params: any) => {
    const headers = getAuthHeaders();
    return dataProvider.update(resource, {
      ...params,
      options: { headers },
    });
  },

  updateMany: (resource: string, params: any) => {
    const headers = getAuthHeaders();
    return dataProvider.updateMany(resource, {
      ...params,
      options: { headers },
    });
  },

  delete: (resource: string, params: any) => {
    const headers = getAuthHeaders();
    return dataProvider.delete(resource, {
      ...params,
      options: { headers },
    });
  },

  deleteMany: (resource: string, params: any) => {
    const headers = getAuthHeaders();
    return dataProvider.deleteMany(resource, {
      ...params,
      options: { headers },
    });
  },
};

export default authenticatedDataProvider;
