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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
    MatSnackBarModule,
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
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Login form with email and password fields
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Signup form with name, email, password
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {}

  showMessage(message: string, isError: boolean = false) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar'],
    });
  }

  // Handle login form submission
  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          this.showMessage('Login successful! Welcome back to Ifarm.');
          this.router.navigate(['/services']);
        })
        .catch((error) => {
          this.showMessage(`Login failed: ${error.message}`, true);
        });
    } else {
      this.showMessage('Please fill in all required fields correctly', true);
    }
  }

  // Handle signup form submission
  onSignup() {
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          this.showMessage('Account created successfully! Welcome to iFarm.');
          this.router.navigate(['/services']);
        })
        .catch((error) => {
          this.showMessage(`Signup failed: ${error.message}`, true);
        });
    } else {
      this.showMessage('Please fill in all required fields correctly', true);
    }
  }
}
