export interface MapBoxSearchResponse {
  suggestions: Suggestion[];
  attribution: string;
}

export interface Suggestion {
  name: string;
  context: Context;
  mapbox_id: string;
  [key: string]: unknown;
}

export interface Context {
  country: Country;
  region: Region;
  [key: string]: unknown;
}

export interface Country {
  country_code: string;
  country_code_alpha_3: string;
  id: string;
  name: string;
}

export interface Region {
  id: string;
  name: string;
  region_code: string;
  region_code_full: string;
}

export interface Location {
  name: string;
  country: Country;
  region: Region;
  mapBoxId: string;
  coordinates: Coordinates;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MapBoxRetrieveResponse {
  attribution: string;
  features: Feature[];
}

export interface Feature {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

export interface Geometry {
  coordinates: string[];
  geometry: string;
}

export interface Properties {
  coordinates: Coordinates;
  [key: string]: unknown;
}
