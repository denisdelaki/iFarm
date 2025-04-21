import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable<boolean>((observer) => {
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        if (user) {
          // User is signed in
          observer.next(true);
        } else {
          // User is not signed in, redirect to login
          this.router.navigate(['/login']);
          observer.next(false);
        }
        observer.complete();
        unsubscribe();
      });
    });
  }
}
