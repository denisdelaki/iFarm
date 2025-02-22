import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule, 
    MatButtonModule,
    MatIconModule,
    CommonModule 
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;

  constructor() { }

  ngOnInit() { }
  
  navigationItems = [
    { path: 'home', label: 'Home' },
    { path: 'services', label: 'Services' },
    { path: 'about', label: 'About' },
    { path: 'testimonials', label: 'Testimonials' },
    { path: 'contact', label: 'Contact' }
  ];

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  scrollToSection(sectionId: string) {
    const cleanId = sectionId.replace('/', '');
    const element = document.getElementById(cleanId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    this.isMenuOpen = false;
  }
}
