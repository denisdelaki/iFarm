import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PestDiseaseService } from '../pest-disease.service';

interface PestDisease {
  id: number;
  name: string;
  type: 'pest' | 'disease';
  category: 'plant' | 'animal';
  description: string;
  affectedSpecies: string[];
  seasons: string[];
  regions: string[];
  symptoms: string[];
  preventionMethods: string[];
  controlMethods: string[];
  imageUrl: string;
}

@Component({
  selector: 'app-pest-disease-monitor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatExpansionModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './pest-disease-monitor.component.html',
  styleUrls: ['./pest-disease-monitor.component.css'],
})
export class PestDiseaseMonitorComponent implements OnInit {
  pestDiseases: PestDisease[] = [];
  filteredPestDiseases: PestDisease[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  // Filter options
  filterType: string = 'all';
  filterCategory: string = 'all';
  filterSeason: string = 'all';
  filterRegion: string = 'all';
  searchTerm: string = '';

  // Lists for filter dropdowns
  seasons: string[] = ['Spring', 'Summer', 'Fall', 'Winter', 'Rainy', 'Dry'];
  regions: string[] = [
    'Central Kenya',
    'Coastal Kenya',
    'Eastern Kenya',
    'Nairobi',
    'North Eastern Kenya',
    'Nyanza',
    'Rift Valley',
    'Western Kenya',
  ];

  constructor(private pestDiseaseService: PestDiseaseService) {}

  ngOnInit(): void {
    this.loadPestDiseaseData();
  }

  loadPestDiseaseData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.pestDiseaseService.getPestDiseases().subscribe({
      next: (data: PestDisease[]) => {
        this.pestDiseases = data;
        this.filteredPestDiseases = data;
        this.isLoading = false;
        this.applyFilters();
      },
      error: (error: any) => {
        this.errorMessage =
          'Failed to load pest and disease data. Please try again.';
        this.isLoading = false;
        console.error('Error loading data:', error);
      },
    });
  }

  applyFilters(): void {
    this.filteredPestDiseases = this.pestDiseases.filter((item) => {
      // Filter by type
      if (this.filterType !== 'all' && item.type !== this.filterType) {
        return false;
      }

      // Filter by category
      if (
        this.filterCategory !== 'all' &&
        item.category !== this.filterCategory
      ) {
        return false;
      }

      // Filter by season
      if (
        this.filterSeason !== 'all' &&
        !item.seasons.includes(this.filterSeason)
      ) {
        return false;
      }

      // Filter by region
      if (
        this.filterRegion !== 'all' &&
        !item.regions.includes(this.filterRegion)
      ) {
        return false;
      }

      // Filter by search term
      if (
        this.searchTerm &&
        !item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        !item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }

  resetFilters(): void {
    this.filterType = 'all';
    this.filterCategory = 'all';
    this.filterSeason = 'all';
    this.filterRegion = 'all';
    this.searchTerm = '';
    this.applyFilters();
  }

  retryLoad(): void {
    this.loadPestDiseaseData();
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = '';
  }
}
