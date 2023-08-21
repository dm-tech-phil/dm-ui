import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, catchError, finalize, of, switchMap, tap } from 'rxjs';
import { Message } from '../models/common.model';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginRequest, User } from '../models/login.model';
import { LoginService } from './login.service';

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
export class LoginStore extends ComponentStore<State> {
  constructor(private loginService: LoginService) {
    super(initialState);
  }

  user: User | undefined;

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

  readonly login = this.effect((loader$: Observable<LoginRequest>) =>
    loader$.pipe(
      tap(() => this.updateLoading(true)),
      switchMap((loginRequest) =>
        this.loginService.register(loginRequest).pipe(
          tap((isSuccess: boolean) => {
            this.updateMessages([
              {
                message: 'Login successful',
                code: 'SUCCESS',
              },
            ]);
            this.user = {
              userId: loginRequest.username,
              displayName: 'StubUser',
              email: loginRequest.username,
              country: 'StubCountry',
              city: 'StubCity',
              latitude: 0,
              longitude: 0,
            };
            this.updateIsSuccess(isSuccess);
          }),
          catchError(() => {
            this.updateMessages([
              {
                message: 'An incorrect username or password was specified.',
                code: 'FAILURE',
              },
            ]);
            this.updateIsSuccess(false);
            return of(undefined);
          }),
          finalize(() => this.updateLoading(false))
        )
      )
    )
  );
}
