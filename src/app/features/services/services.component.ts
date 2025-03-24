import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { HeaderComponent } from '../../home/header/header.component';
import { MarketAnalysisComponent } from '../market-analysis/market-analysis.component';
import { WeatherForecastComponent } from '../weather-forecast/weather-forecast.component';
import { PestDiseaseMonitorComponent } from '../pest-disease-monitor/pest-disease-monitor.component';

@Component({
  selector: 'app-services',
  imports: [
    MatButtonToggleModule,
    CommonModule,
    HeaderComponent,
    MarketAnalysisComponent,
    WeatherForecastComponent,
    PestDiseaseMonitorComponent,
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent {
  selectedService: string = 'weather'; // Default selection is Weather Forecast

  onServiceChange(event: any) {
    this.selectedService = event.value;
    console.log('Selected service:', this.selectedService); // For debugging
    // Add logic here to fetch data or trigger actions based on the selected service
  }
}
