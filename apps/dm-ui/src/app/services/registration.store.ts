import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, catchError, finalize, of, switchMap, tap } from 'rxjs';
import { RegistrationService } from './registration.service';
import { RegistrationRequest } from '../models/registration.model';
import { Message } from '../models/common.model';
import { HttpErrorResponse } from '@angular/common/http';

interface State {
  loading: boolean;
  isSuccess: boolean | undefined;
  messages: Message[];
}

const initialState: State = {
  loading: false,
  isSuccess: undefined,
  messages: [],
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

  readonly updateIsSuccess = this.updater<boolean>((state, isSuccess) => ({ ...state, isSuccess }));
  readonly isSuccess$ = this.select((state) => state.isSuccess);

  readonly updateMessages = this.updater<Message[]>((state, messages) => ({
    ...state,
    messages: messages,
  }));
  readonly messages$ = this.select((state) => state.messages);

  readonly register = this.effect((loader$: Observable<RegistrationRequest>) =>
    loader$.pipe(
      tap(() => this.updateLoading(true)),
      switchMap((registrationRequest) =>
        this.registrationService.register(registrationRequest).pipe(
          tap((isSuccess: boolean) => {
            this.updateMessages([
              {
                message: 'Registration successful',
                code: 'SUCCESS',
              },
            ]);
            this.updateIsSuccess(isSuccess);
          }),
          catchError((response: HttpErrorResponse) => {
            console.error(response);
            this.updateMessages([response.error]);
            this.updateIsSuccess(false);
            return of(undefined);
          }),
          finalize(() => this.updateLoading(false))
        )
      )
    )
  );
}
