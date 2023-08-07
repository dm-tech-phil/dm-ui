import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

import { Location, MapBoxResponse, Suggestion } from '../models/location.model';
import { mapbox } from '../constants/mapbox';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpClient) {}
  readonly sessionToken = uuidv4();

  getLocations(term = ''): Observable<Location[]> {
    if (term) {
      return this.http
        .get<MapBoxResponse>(
          `https://api.mapbox.com/search/searchbox/v1/suggest?q=${term}&language=en&types=city&session_token=${this.sessionToken}&access_token=${mapbox.accessToken}`
        )
        .pipe(
          map((response) => this.convertResultToLocations(response.suggestions))
        );
    } else {
      return of([]);
    }
  }

  private convertResultToLocations(suggestions: Suggestion[]): Location[] {
    return suggestions.map(
      (suggestion) =>
        ({
          name: suggestion.name,
          country: suggestion.context.country,
          region: suggestion.context.region,
        } as Location)
    );
  }
}
