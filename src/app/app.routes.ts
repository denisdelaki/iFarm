import { Routes } from '@angular/router';
import { LandingPageComponent } from './home/landing-page/landing-page.component';
import { AuthenticationComponent } from './auth/authentication/authentication.component';
import { MyProfileComponent } from './features/my-profile/my-profile.component';
import { ServicesComponent } from './features/services/services.component';
import { AuthGuard } from './auth/auth.guard';
import { MarketPlaceComponent } from './features/market-place/market-place.component';

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
    canActivate: [AuthGuard],
  },
  {
    path: 'myservices',
    component: ServicesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'marketplace',
    component: MarketPlaceComponent,
    canActivate: [AuthGuard],
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
