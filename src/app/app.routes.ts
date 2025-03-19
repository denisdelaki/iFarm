import { Routes } from '@angular/router';
import { LandingPageComponent } from './home/landing-page/landing-page.component';
import { AuthenticationComponent } from './auth/authentication/authentication.component';
import { MyProfileComponent } from './features/my-profile/my-profile.component';

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
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
