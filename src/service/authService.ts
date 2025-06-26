import { IGenericResponse } from "../types";
import { CredentialsAuthRequest, AuthResponse, UserInfoResponse } from "../types/auth";

export class AuthService {
  private _baseApiUrl: string = process.env.apiBaseUrl + '/auth'
  private _apiToken: string = 'UNDEFINED';

  constructor(apiToken?: string) {
    if (apiToken) {
      this._apiToken = apiToken;
    }
  }

  public setApiToken(token: string): void {
    this._apiToken = token;
  }

  public async loginWithCredentials(req: CredentialsAuthRequest): Promise<IGenericResponse<AuthResponse>> {
    const response = await fetch(this._baseApiUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(req)
    });

    if (response.ok) {
      const data: AuthResponse = await response.json();
      return { success: true, data: data, status: response.status };
    } 

    return { success: false, status: response.status };
  }

  public async getUserInfo(): Promise<IGenericResponse<UserInfoResponse>> {
    const response = await fetch(`${this._baseApiUrl}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${this._apiToken}`
      },
      method: 'GET',
    });

    if (response.ok) {
      const data: UserInfoResponse = await response.json();
      return { success: true, data: data, status: response.status };
    }

    return { success: false, status: response.status };
  }
}