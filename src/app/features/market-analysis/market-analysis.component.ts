import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MarketDataService, MarketProduct } from '../market-data.service';

import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-market-analysis',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './market-analysis.component.html',
  styleUrl: './market-analysis.component.css',
})
export class MarketAnalysisComponent implements OnInit {
  products: MarketProduct[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  selectedProduct: MarketProduct | null = null;
  showDetailView: boolean = false;

  // Chart configuration
  priceChartData: ChartConfiguration<'line'>['data'] | null = null;
  demandChartData: ChartConfiguration<'line'>['data'] | null = null;
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  constructor(
    private marketDataService: MarketDataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMarketData();
  }

  loadMarketData(): void {
    this.isLoading = true;
    this.marketDataService.getMarketProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching market data:', error);
        this.errorMessage =
          'Failed to load market data. Please try again later.';
        this.isLoading = false;
        this.showMessage(this.errorMessage, true);
      },
    });
  }

  viewProductDetails(product: MarketProduct): void {
    this.selectedProduct = product;
    this.showDetailView = true;
    this.prepareChartData(product);
  }

  backToList(): void {
    this.showDetailView = false;
    this.selectedProduct = null;
  }

  prepareChartData(product: MarketProduct): void {
    // Prepare price chart data
    const priceLabels = product.priceHistory.map((item) => item.date);
    const priceData = product.priceHistory.map((item) => item.price);

    this.priceChartData = {
      labels: priceLabels,
      datasets: [
        {
          data: priceData,
          label: `${product.name} Price (${product.priceUnit})`,
          fill: false,
          tension: 0.1,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    };

    // Prepare demand chart data
    const demandLabels = product.demandHistory.map((item) => item.date);
    const demandData = product.demandHistory.map((item) => item.value);

    this.demandChartData = {
      labels: demandLabels,
      datasets: [
        {
          data: demandData,
          label: `${product.name} Demand (scale 0-100)`,
          fill: false,
          tension: 0.1,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
  }

  getPriceChangeClass(priceChange: number): string {
    return priceChange >= 0 ? 'positive-change' : 'negative-change';
  }

  getDemandClass(demand: string): string {
    switch (demand) {
      case 'High':
        return 'high-demand';
      case 'Medium':
        return 'medium-demand';
      case 'Low':
        return 'low-demand';
      default:
        return '';
    }
  }

  showMessage(message: string, isError: boolean = false) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar'],
    });
  }
}
