import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, catchError, filter, of, switchMap, tap } from 'rxjs';
import { Message } from '../models/common.model';
import { MapService } from './map.service';
import { Location, MapBoxRetrieveResponse } from '../models/location.model';

interface State {
  loading: boolean;
  errorMessages: Message[];
  locations: Location[];
  locationDetails: MapBoxRetrieveResponse | null;
}

const initialState: State = {
  loading: false,
  errorMessages: [],
  locations: [],
  locationDetails: null,
};

@Injectable({
  providedIn: 'root',
})
@Injectable()
export class MapboxStore extends ComponentStore<State> {
  constructor(private mapService: MapService) {
    super(initialState);
  }

  readonly updateLoading = this.updater<boolean>((state, loading) => ({ ...state, loading }));
  readonly loading$ = this.select((state) => state.loading);

  readonly updateErrorMessages = this.updater<Message[]>((state, errorMessages) => ({ ...state, errorMessages }));
  readonly errorMessages$ = this.select((state) => state.errorMessages);

  readonly updateLocations = this.updater<Location[]>((state, locations) => ({ ...state, locations }));
  readonly locations$ = this.select((state) => state.locations);

  readonly updateLocationDetails = this.updater<MapBoxRetrieveResponse>((state, locationDetails) => ({ ...state, locationDetails }));
  readonly locationDetails$ = this.select((state) => state.locationDetails);

  readonly getLocations = this.effect((loader$: Observable<string>) =>
    loader$.pipe(
      filter((term) => !!term),
      tap(() => this.updateLoading(true)),
      switchMap((term) =>
        this.mapService.getLocations(term).pipe(
          catchError((error) => {
            this.updateErrorMessages([
              {
                message: error,
                code: 'ERROR',
              } as Message,
            ]);
            return of([]);
          })
        )
      ),
      tap(() => this.updateLoading(false)),
      tap((locations: Location[]) => this.updateLocations(locations))
    )
  );

  readonly getLocationDetails = this.effect((mapboxId$: Observable<string>) =>
    mapboxId$.pipe(
      // filter((id) => !!id),
      tap(() => this.updateLoading(true)),
      switchMap((id) =>
        this.mapService.getLocationDetails(id).pipe(
          catchError((error) => {
            this.updateErrorMessages([
              {
                message: error,
                code: 'ERROR',
              } as Message,
            ]);
            return of([]);
          })
        )
      ),
      tap(() => this.updateLoading(false)),
      tap((locationDetail: any) => this.updateLocationDetails(locationDetail))
    )
  );
}
