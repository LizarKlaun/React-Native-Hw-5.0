export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: UserData;
}