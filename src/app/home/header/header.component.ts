import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  navigationItems = [
    { path: 'home', label: 'Home' },
    { path: 'services', label: 'Services' },
    { path: 'about', label: 'About' },
    { path: 'testimonials', label: 'Testimonials' },
    { path: 'contact', label: 'Contact' },
  ];

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
}
