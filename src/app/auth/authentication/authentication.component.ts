import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { HeaderComponent } from '../../home/header/header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    CommonModule,
    HeaderComponent,
  ],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css',
})
export class AuthenticationComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    // Login form with email and password fields
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Signup form with name, email, password, and confirm password fields
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.signupForm.statusChanges.subscribe((value: any) => {
      console.log(value);
    });
  }

  // Handle login form submission
  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          console.log('User logged in:', userCredential.user);
          this.router.navigate(['/myprofile']);
        })
        .catch((error) => {
          console.error('Login error:', error.message);
        });
    }
  }

  // Handle signup form submission
  onSignup() {
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          console.log('User signed up:', userCredential.user);
          this.router.navigate(['/myprofile']);
        })
        .catch((error) => {
          console.error('Signup error:', error.message);
        });
    }
  }
}
