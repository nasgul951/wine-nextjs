import { IGenericResponse, PagedResponse, SortModel, Varietal } from "../types";
import { Bottle, Wine, WineFilter, NewBottleRequest, PatchBottleRequest, GetWinesOptions, PatchWineRequest, NewWineRequest } from "../types/wine";

export class WineService {
  private _baseApiUrl: string = process.env.apiBaseUrl + '/wine'
  private _apiToken: string = process.env.apiKey!


  public async getVarietals(): Promise<IGenericResponse<Varietal[]>> {
    const response = await fetch(`${this._baseApiUrl}/varietals`, {
      headers: {
        'Authorization': `Bearer ${this._apiToken}`
      },
      method: 'GET',
    });

    if (response.ok) {
      const data: Varietal[] = await response.json();
      return { success: true, data: await data, status: response.status };
    } 

    throw new Error(`Failed to fetch varietals: ${response.statusText}`);
  }

  public async getWineById(wineId: number): Promise<IGenericResponse<Wine>> {
    const response = await fetch(`${this._baseApiUrl}/${wineId}`, {
      headers: {
        'Authorization': `Bearer ${this._apiToken}`
      },
      method: 'GET',
    });

    if (response.ok) {
      const data: Wine = await response.json();
      return { success: true, data: data, status: response.status };
    }

    throw new Error(`Failed to fetch wine with id:${wineId}: ${response.statusText}`);
  }
  
  public async getWines(opt: GetWinesOptions): Promise<IGenericResponse<PagedResponse<Wine>>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', opt.page.toString());
    queryParams.append('pageSize', opt.pageSize.toString());
    if (opt.sortModel && opt.sortModel.field) {
      queryParams.append('sortField', opt.sortModel.field);
      queryParams.append('sortDirection', opt.sortModel.sort);
    }
    if (opt.filter) {
      queryParams.append('filter', JSON.stringify(opt.filter));
    }
 
    const response = await fetch(`${this._baseApiUrl}/query?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${this._apiToken}`
      },
      method: 'GET',
    });

    if (response.ok) {
      const data: PagedResponse<Wine> = await response.json();
      return { success: true, data: data, status: response.status };
    }

    throw new Error(`Failed to fetch wine: ${response.statusText}`);
  }

  public async getBottlesByWineId(wineId: number): Promise<IGenericResponse<Bottle[]>> {
    const response = await fetch(`${this._baseApiUrl}/${wineId}/bottles`, {
      headers: {
        'Authorization': `Bearer ${this._apiToken}`
      },
      method: 'GET',
    });

    if (response.ok) {
      const data: Bottle[] = await response.json();
      return { success: true, data: data, status: response.status };
    }

    throw new Error(`Failed to fetch bottles for wineId:${wineId}: ${response.statusText}`);
  }

  public async addWine(req: NewWineRequest): Promise<IGenericResponse<Wine>> {
    const response = await fetch(`${this._baseApiUrl}`, {
      headers: {
        'Authorization': `Bearer ${this._apiToken}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(req)
    });
  
    if (response.ok) {
      const data: Wine = await response.json();
      return { success: true, data: data, status: response.status };
    }
  
    throw new Error(`Failed to add wine: ${response.statusText}`);
  }

  public async patchWine(wineId: number, req: PatchWineRequest): Promise<IGenericResponse<Wine>> {
    const response = await fetch(`${this._baseApiUrl}/${wineId}`, {
      headers: {
        'Authorization': `Bearer ${this._apiToken}`,
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify(req)
    });

    if (response.ok) {
      const data: Wine = await response.json();
      return { success: true, data, status: response.status };
    }

    throw new Error(`Failed to update wine with id:${wineId}: ${response.statusText}`);
  }

  public async addBottle(req: NewBottleRequest): Promise<IGenericResponse<Bottle>> {
    const response = await fetch(`${this._baseApiUrl}/bottles`, {
      headers: {
        'Authorization': `Bearer ${this._apiToken}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(req)
    });

    if (response.ok) {
      const data: Bottle = await response.json();
      return { success: true, data, status: response.status };
    }

    throw new Error(`Failed to add bottle for wineId:${wineId}: ${response.statusText}`);
  }

  public async patchBottle(bottleId: number, req: PatchBottleRequest): Promise<IGenericResponse<Bottle>> {
    const response = await fetch(`${this._baseApiUrl}/bottles/${bottleId}`, {
      headers: {
        'Authorization': `Bearer ${this._apiToken}`,
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify(req)
    });


    if (response.ok) {
      const data: Bottle = await response.json();
      return { success: true, data, status: response.status };
    }

    throw new Error(`Failed to patch bottle with id:${bottleId}: ${response.statusText}`);
  }
}