import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  testimonials = [
    {
      name: 'John Doe',
      role: 'Farmer',
      image: 'https://media.istockphoto.com/id/1414494585/photo/female-farmer-looking-at-cloudy-sky-while-sitting-amidst-corn-crops-in-farm.webp?a=1&b=1&s=612x612&w=0&k=20&c=uuYqrSY0I79WzV8SbXJM8l7sHPalw07_wkVpo0Xqg08=',
      text: 'iFarm has revolutionized how I manage my farm. The real-time weather updates have been invaluable.'
    },
    {
      name: 'Sarah Smith',
      role: 'Agricultural Consultant',
      image: 'https://media.istockphoto.com/id/1973898408/photo/female-agronomist-and-farmer-at-soybean-crop.webp?a=1&b=1&s=612x612&w=0&k=20&c=5JDEYtGv06bN621BQ5WpY_VFOvPMR1u1P9zBlE0A6co=',
      text: 'The market analysis tools have helped my clients make better decisions about when to sell their produce.'
    },
    {
      name: 'Michael Brown',
      role: 'Farm Owner',
      image: 'https://media.istockphoto.com/id/1703985772/photo/happy-black-man-portrait-and-animals-in-farming-agriculture-or-sustainability-in-the.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ma_aeFQtqfUOGG1RjwXq7ixp5s9FpnvS3PEaxppmHKw=',
      text: 'The pest monitoring system helped me save my crops last season. Excellent service!'
    }
  ];
}