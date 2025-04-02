import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: any[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}
@Component({
  selector: 'app-weather-forecast',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './weather-forecast.component.html',
  styleUrl: './weather-forecast.component.css',
})
export class WeatherForecastComponent implements OnInit {
  weatherData!: WeatherData;
  location: string = 'Nairobi';
  apiKey: string = '0f2729391913987769707a5981185b21';
  isLoading: boolean = false;
  errorMessage: string = '';
  daysToShow: number = 5;
  filteredForecasts: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getWeatherData();
  }

  getWeatherData() {
    this.isLoading = true;
    this.errorMessage = '';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${this.location}&appid=${this.apiKey}&units=metric`;

    this.http.get(url).subscribe({
      next: (data: any) => {
        // console.log(data);
        this.weatherData = data;
        this.updateDaysFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching weather data:', error);
        this.isLoading = false;
        this.errorMessage = `Failed to get weather data: ${
          error.message || 'Unknown error'
        }`;
      },
    });
  }

  updateLocation(newLocation: string) {
    this.location = newLocation;
    this.getWeatherData();
  }

  updateDaysFilter() {
    if (!this.weatherData || !this.weatherData.list) return;

    if (this.daysToShow === 0) {
      // Show all available forecasts
      this.filteredForecasts = this.weatherData.list;
    } else {
      // Calculate how many 3-hour intervals to show based on days
      const intervalsToShow = this.daysToShow * 8; // 8 intervals per day (3 hours each)
      this.filteredForecasts = this.weatherData.list.slice(0, intervalsToShow);
    }
  }
}
