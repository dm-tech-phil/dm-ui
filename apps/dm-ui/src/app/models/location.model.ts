export interface MapBoxResponse {
  suggestions: Suggestion[];
  attribution: string;
}

export interface Suggestion {
  name: string;
  context: Context;
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
}
