import { Route } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';

export const appRoutes: Route[] = [
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent }
];
