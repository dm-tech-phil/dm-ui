import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  Subject,
  catchError,
  concat,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { MapService } from '../../services/map.service';
import { Location } from '../../models/location.model';

@Component({
  selector: 'dmui-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  constructor(private readonly mapService: MapService) {}

  readonly birthYears = Array.from(
    { length: 30 },
    (x, i) => new Date().getFullYear() - 13 - i
  );

  region = '';
  country = '';

  locationsInput$ = new Subject<string>();

  locations$ = concat(
    of([]), // default items
    this.locationsInput$.pipe(
      distinctUntilChanged(),
      tap(() => (this.locationsLoading = true)),
      switchMap((term) =>
        this.mapService.getLocations(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => (this.locationsLoading = false))
        )
      )
    )
  );
  locationsLoading = false;

  onLocationChange(location: Location) {
    if (location.country) {
      this.country = location.country.name;
    }
    if (location.region) {
      this.region = location.region.name;
    }
  }
}
