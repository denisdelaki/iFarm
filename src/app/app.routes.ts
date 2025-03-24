import { Routes } from '@angular/router';
import { LandingPageComponent } from './home/landing-page/landing-page.component';
import { AuthenticationComponent } from './auth/authentication/authentication.component';
import { MyProfileComponent } from './features/my-profile/my-profile.component';
import { ServicesComponent } from './features/services/services.component';

export const routes: Routes = [
  {
    path: 'home',
    component: LandingPageComponent,
  },
  {
    path: 'login',
    component: AuthenticationComponent,
  },
  {
    path: 'myprofile',
    component: MyProfileComponent,
  },
  {
    path: 'services',
    component: ServicesComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
