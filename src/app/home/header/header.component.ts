import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isLoggedIn = false;
  private authSubscription: Subscription | null = null;

  constructor(private router: Router, private auth: Auth) {}

  ngOnInit() {
    // Subscribe to authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy() {
    // Clean up subscription when component is destroyed
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Public navigation items (visible to all users)
  publicNavigationItems = [
    { path: 'home', label: 'Home' },
    { path: 'services', label: 'Services' },
    { path: 'about', label: 'About' },
    { path: 'testimonials', label: 'Testimonials' },
    { path: 'contact', label: 'Contact' },
  ];

  // Private navigation items (visible only to logged-in users)
  privateNavigationItems = [
    { path: 'myprofile', label: 'My Profile' },
    { path: 'myservices', label: 'My Services' },
  ];

  // Method to handle navigation
  navigate(path: string) {
    // Check if it's a private navigation item
    if (path === 'myprofile' || path === 'myservices') {
      // Direct navigation to route
      this.router.navigate(['/' + path]);
    } else {
      // Use scroll behavior for public items
      this.scrollToSection(path);
    }

    this.isMenuOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollToSection(sectionId: string) {
    const cleanId = sectionId.replace('/', '');

    // Check if we're on the landing page
    if (this.router.url.includes('/home') || this.router.url === '/') {
      // If on landing page, just scroll to the section
      const element = document.getElementById(cleanId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on landing page, navigate to home with fragment
      this.router.navigate(['/home'], { fragment: cleanId });
    }

    this.isMenuOpen = false;
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.auth
      .signOut()
      .then((): void => {
        this.router.navigate(['/home']);
      })
      .catch((error: any): void => {
        console.error('Logout error:', error);
      });
  }
}
