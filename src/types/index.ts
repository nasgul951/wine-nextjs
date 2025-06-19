export interface IGenericResponse<T> {
  success: boolean;
  data: T;
  status: number;
  errors?: string[];
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
}

export interface SortModel {
  field: string;
  sort: 'asc' | 'desc';
}

export type Varietal {
  name: string;
  count: number;
}
