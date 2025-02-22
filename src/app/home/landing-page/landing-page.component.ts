import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AboutComponent } from '../about/about.component';
import { ServicesComponent } from '../services/services.component';
import { ContactsComponent } from '../contacts/contacts.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { MaterialModule } from '../../shared/material';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-landing-page',
  imports: [
    HeaderComponent,
    AboutComponent,
    ServicesComponent,
    ContactsComponent,
    TestimonialsComponent,
    MatDividerModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
