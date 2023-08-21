import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Subject, debounceTime, filter, takeUntil, tap } from 'rxjs';
import { Coordinates, Location } from '../../models/location.model';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RegistrationRequest } from '../../models/registration.model';
import { RegistrationStore } from '../../services/registration.store';
import { ActivatedRoute } from '@angular/router';
import { MapboxStore } from '../../services/mapbox.store';

@Component({
  selector: 'dmui-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent implements OnInit {
  emailParam = this.route.snapshot.queryParamMap.get('email') ?? '';

  form = this.formBuilder.group(
    {
      displayName: new FormControl('', [Validators.required]),
      email: new FormControl(this.emailParam, [Validators.required, Validators.email]),
      password: new FormControl(
        '',
        Validators.compose([
          // 1. Password Field is Required
          Validators.required,
          // 2. check whether the entered password has a number
          this.patternValidator(/\d/, { hasNumber: true }),
          // 3. check whether the entered password has upper case letter
          this.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          // 4. check whether the entered password has a lower-case letter
          this.patternValidator(/[a-z]/, { hasSmallCase: true }),
          // 5. check whether the entered password has a special character
          this.patternValidator(/[.!@#$%^&*()_+\-=]/, {
            hasSpecialCharacters: true,
          }),
          // 6. Has a minimum length of 12 characters
          Validators.minLength(12),
        ])
      ),
      matchingPassword: new FormControl('', Validators.required),
      birthYear: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      terms: new FormControl(false, Validators.requiredTrue),
    },
    { validator: this.passwordMatch } as AbstractControlOptions
  );

  messages$ = this.registrationStore.messages$;
  isSuccess$ = this.registrationStore.isSuccess$;

  constructor(
    private readonly registrationStore: RegistrationStore,
    private readonly mapboxStore: MapboxStore,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute
  ) {
    const unsubscribed$ = new Subject<void>();

    this.mapboxStore.locationDetails$
      .pipe(
        takeUntil(unsubscribed$),
        tap((locationDetails) => {
          if (locationDetails) {
            this.coordinates = locationDetails.features[0].properties.coordinates;
          }
          unsubscribed$.next();
          unsubscribed$.complete();
        })
      )
      .subscribe();
  }

  readonly birthYears = Array.from({ length: 30 }, (x, i) => new Date().getFullYear() - 13 - i);

  region = '';
  country = '';
  city = '';
  coordinates: Coordinates | undefined;

  locationsInput$ = new Subject<string>();
  locations$ = this.mapboxStore.locations$;

  ngOnInit(): void {
    //const unsubscribed$ = new Subject<void>();
    this.locationsInput$
      .pipe(
        //takeUntil(unsubscribed$),
        filter((term) => term?.length >= 2),
        debounceTime(200),
        tap((term) => {
          this.mapboxStore.getLocations(term);
          //unsubscribed$.next();
          //unsubscribed$.complete();
        })
      )
      .subscribe();
  }

  onLocationChange(location: Location) {
    if (location.city) {
      this.city = location.city;
    }
    if (location.country) {
      this.country = location.country.country_code;
    }
    if (location.region) {
      this.region = location.region.name;
    }
    this.mapboxStore.getLocationDetails(location.mapBoxId);
  }

  passwordMatch(formGroup: AbstractControl) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('matchingPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const password: string = passwordControl.value;
    const confirmPassword: string = confirmPasswordControl.value;

    if (!confirmPassword.length) {
      return null;
    }

    if (password !== confirmPassword) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

  onRegister(): void {
    const registrationRequest: RegistrationRequest = {
      userId: this.form.get('email')?.value ?? '',
      displayName: this.form.get('displayName')?.value ?? '',
      email: this.form.get('email')?.value ?? '',
      password: this.form.get('password')?.value ?? '',
      country: this.country,
      city: this.city,
      //birthYear: this.form.get('birthYear')?.value ?? 0,
      latitude: this.coordinates?.latitude ?? 0,
      longitude: this.coordinates?.longitude ?? 0,
    };
    this.registrationStore.register(registrationRequest);
  }
}
