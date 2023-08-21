export interface RegistrationRequest {
  userId: string;
  displayName: string;
  email: string;
  password: string;
  //birthYear: number;
  country: string;
  city: string;
  region?: string;
  district?: string;
  latitude: number;
  longitude: number;
}
