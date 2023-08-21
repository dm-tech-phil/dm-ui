import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoginRequest } from '../../models/login.model';
import { LoginStore } from '../../services/login.store';
import { Subject, takeUntil, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'dmui-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  form = this.formBuilder.group({
    username: new FormControl(localStorage.getItem('username'), Validators.required),
    password: new FormControl('', Validators.required),
  });

  messages$ = this.loginStore.messages$;
  isSuccess$ = this.loginStore.isSuccess$;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly loginStore: LoginStore,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  onLogin(): void {
    localStorage.setItem('username', this.form.get('username')?.value ?? '');

    const loginRequest: LoginRequest = {
      username: this.form.get('username')?.value ?? '',
      password: this.form.get('password')?.value ?? '',
    };
    this.loginStore.login(loginRequest);

    const unsubscribed$ = new Subject<void>();

    this.isSuccess$
      .pipe(
        takeUntil(unsubscribed$),
        tap((isSuccess) => {
          if (isSuccess) {
            console.log('login success');
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            console.log('return url', returnUrl);
            this.router.navigateByUrl(returnUrl);
            unsubscribed$.next();
            unsubscribed$.complete();
          }
        })
      )
      .subscribe();
  }
}
