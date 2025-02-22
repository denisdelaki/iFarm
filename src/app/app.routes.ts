import { Routes } from '@angular/router';
import { LandingPageComponent } from './home/landing-page/landing-page.component';

export const routes: Routes = [
    {
        path: 'home',
        component: LandingPageComponent
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
