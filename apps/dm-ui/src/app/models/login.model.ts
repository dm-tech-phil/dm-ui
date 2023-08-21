export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  userId: string;
  displayName: string;
  email: string;
  //birthYear: number;
  country: string;
  city: string;
  region?: string;
  district?: string;
  latitude: number;
  longitude: number;
}
