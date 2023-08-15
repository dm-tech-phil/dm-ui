import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, catchError, finalize, of, switchMap, tap } from 'rxjs';
import { RegistrationService } from './registration.service';
import { RegistrationRequest } from '../models/registration.model';
import { ErrorMessage } from '../models/common.model';

interface State {
  loading: boolean;
  errorMessages: ErrorMessage[];
}

const initialState: State = {
  loading: false,
  errorMessages: [],
};

@Injectable({
  providedIn: 'root',
})
@Injectable()
export class RegistrationStore extends ComponentStore<State> {
  constructor(private registrationService: RegistrationService) {
    super(initialState);
  }

  readonly updateLoading = this.updater<boolean>((state, loading) => ({
    ...state,
    loading,
  }));
  readonly loading$ = this.select((state) => state.loading);

  readonly updateErrorMessages = this.updater<ErrorMessage[]>(
    (state, errorMessages) => ({
      ...state,
      errorMessages,
    })
  );
  readonly errorMessages$ = this.select((state) => state.errorMessages);

  readonly register = this.effect((loader$: Observable<RegistrationRequest>) =>
    loader$.pipe(
      tap(() => this.updateLoading(true)),
      switchMap((registrationRequest) =>
        this.registrationService.register(registrationRequest).pipe(
          catchError((error) => {
            this.updateErrorMessages([
              {
                message: 'Problem with registration',
                code: 'ERROR',
              } as ErrorMessage,
            ]);
            return of(undefined);
          }),
          finalize(() => this.updateLoading(false))
        )
      )
    )
  );
}
