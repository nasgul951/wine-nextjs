import { DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { WineFilter } from '../types/wine';
import { z } from 'zod';

const API_URL = process.env.apiBaseUrl + '/wine';
const API_TOKEN = process.env.apiKey;

export interface Wine extends DataModel {
  varietal: string;
  vineyard: string;
  label: string;
  vintage: number;
  notes: string;
}

export interface Bottle extends DataModel {
  wineId: number;
  storageId: number;
  binX: number;
  binY: number;
  depth: number;
}

export const wineDataSource: DataSource<Wine> = {
  fields: [
    { field: 'id', headerName: 'ID' },
    { field: 'varietal', headerName: 'Varietal', width: 140 },
    { field: 'vineyard', headerName: 'Vineyard', width: 140 },
    { field: 'label', headerName: 'Label', width: 140 },
    { field: 'notes', headerName: 'Notes', width: 200 },
    { field: 'vintage', headerName: 'Vintage', type: 'string' },
  ],
  getMany: async ({ paginationModel, filterModel, sortModel }) => {
    const queryParams = new URLSearchParams();

    queryParams.append('page', paginationModel.page.toString());
    queryParams.append('pageSize', paginationModel.pageSize.toString());
    if (sortModel?.length) {
      queryParams.append('sortField', sortModel[0]?.field || 'id');
      queryParams.append('sortDirection', sortModel[0]?.sort || 'asc');
    }

    if (filterModel?.items?.length) {
      const filter: WineFilter = {}
      filterModel.items.forEach((item) => {
        if (item.field === 'varietal') {
          filter.varietal = item.value;
        } else if (item.field === 'vineyard') {
          filter.vineyard = item.value;
        }
      });
      queryParams.append('filter', JSON.stringify(filter));
    }

    const res = await fetch(`${API_URL}/query?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`
      },
      method: 'GET',
    });
    const resJson = await res.json();

    if (!res.ok) {
      throw new Error(resJson.error);
    }

    return {
      items: resJson.items as Wine[],
      itemCount: resJson.totalCount
    }
  },
  getOne: async (wineId) => {
    const res = await fetch(`${API_URL}/${wineId}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`
      },
      method: 'GET',
    });
    const resJson = await res.json();

    if (!res.ok) {
      throw new Error(resJson.error);
    }
    return resJson;
  },
  createOne: async (data) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${API_TOKEN}`
      },
    });
    const resJson = await res.json();

    if (!res.ok) {
      throw new Error(resJson.error);
    }
    return resJson;
  },
  updateOne: async (wineId, data) => {
    const res = await fetch(`${API_URL}/${wineId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${API_TOKEN}`
      },
    });
    const resJson = await res.json();

    if (!res.ok) {
      throw new Error(resJson.error);
    }
    return resJson;
  },
  deleteOne: async (wineId) => {
    const res = await fetch(`${API_URL}/${wineId}`, { method: 'DELETE' });
    const resJson = await res.json();

    if (!res.ok) {
      throw new Error(resJson.error);
    }
    return resJson;
  },
  validate: z.object({
    name: z.string({ required_error: 'Name is required' }).nonempty('Name is required'),
    age: z.number({ required_error: 'Age is required' }).min(18, 'Age must be at least 18'),
    joinDate: z
      .string({ required_error: 'Join date is required' })
      .nonempty('Join date is required'),
    role: z.enum(['Market', 'Finance', 'Development'], {
      errorMap: () => ({ message: 'Role must be "Market", "Finance" or "Development"' }),
    }),
  })['~standard'].validate,
};

export const wineCache = new DataSourceCache();