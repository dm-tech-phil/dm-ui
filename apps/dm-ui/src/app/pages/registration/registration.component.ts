import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dm-ui-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {}
