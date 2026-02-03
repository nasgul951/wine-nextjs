import { IGenericResponse, IPagedResponse, IPagedRequest } from "../types";
import { User, UserFilter, UpdateUserRequest } from "../types/user";

export class UserService {
  private _baseApiUrl: string = process.env.apiBaseUrl + '/user'
  private _apiToken: string

  constructor(apiToken: string) {
    this._apiToken = apiToken;
  }

  public async getUserById(userId: number): Promise<IGenericResponse<User>> {
    const response = await fetch(`${this._baseApiUrl}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this._apiToken}`
      },
      method: 'GET',
    });

    if (response.ok) {
      const data: User = await response.json();
      return { success: true, data: data, status: response.status };
    }

    return { success: false, status: response.status, errors: [response.statusText] };
  }

  public async getUsers(opt: IPagedRequest<UserFilter>): Promise<IGenericResponse<IPagedResponse<User>>> {
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
      const data: IPagedResponse<User> = await response.json();
      return { success: true, data: data, status: response.status };
    }

    return { success: false, status: response.status, errors: [response.statusText] };
  }

  public async addUser(req: UpdateUserRequest): Promise<IGenericResponse<User>> {
    const response = await fetch(`${this._baseApiUrl}`, {
      headers: {
        'Authorization': `Bearer ${this._apiToken}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(req)
    });

    if (response.ok) {
      const data: User = await response.json();
      return { success: true, data: data, status: response.status };
    }

    return { success: false, status: response.status, errors: [response.statusText] };
  }

  public async patchUser(userId: number, req: UpdateUserRequest): Promise<IGenericResponse<User>> {
    const response = await fetch(`${this._baseApiUrl}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this._apiToken}`,
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify(req)
    });

    if (response.ok) {
      const data: User = await response.json();
      return { success: true, data, status: response.status };
    }

    return { success: false, status: response.status, errors: [response.statusText] };
  }

  public async deleteUser(userId: number): Promise<IGenericResponse<void>> {
    const response = await fetch(`${this._baseApiUrl}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this._apiToken}`
      },
      method: 'DELETE'
    });

    if (response.ok) {
      return { success: true, status: response.status };
    }

    return { success: false, status: response.status, errors: [response.statusText] };
  }
}