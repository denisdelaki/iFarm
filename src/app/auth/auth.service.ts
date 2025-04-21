import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, User, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private auth: Auth, private router: Router) {
    // Listen for authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  get isLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }

  logout() {
    signOut(this.auth)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }
}
