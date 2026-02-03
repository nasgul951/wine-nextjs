export interface CredentialsAuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expires: Date
}

export interface UserInfoResponse {
  userId: number;
  userName: string;
  isAdmin: boolean;
}