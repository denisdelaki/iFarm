import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface MarketProduct {
  id: number;
  name: string;
  currentPrice: number;
  priceUnit: string;
  priceChange: number; // percentage
  demand: 'High' | 'Medium' | 'Low';
  forecast: string;
  priceHistory: {
    date: string;
    price: number;
  }[];
  demandHistory: {
    date: string;
    value: number; // 0-100 scale
  }[];
  description: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class MarketDataService {
  private mockProducts: MarketProduct[] = [
    {
      id: 1,
      name: 'Maize',
      currentPrice: 45.5,
      priceUnit: 'KES/kg',
      priceChange: 5.2,
      demand: 'High',
      forecast:
        'Prices expected to rise by 10% in the next month due to seasonal shortages',
      description:
        'Maize is a staple food in Kenya with consistent demand throughout the year. Current market conditions show increased demand due to export opportunities.',
      image:
        'https://images.unsplash.com/photo-1649251037566-6881b4956615?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      priceHistory: [
        { date: '2023-01-01', price: 40.2 },
        { date: '2023-02-01', price: 41.3 },
        { date: '2023-03-01', price: 42.1 },
        { date: '2023-04-01', price: 41.8 },
        { date: '2023-05-01', price: 42.5 },
        { date: '2023-06-01', price: 43.2 },
        { date: '2023-07-01', price: 43.8 },
        { date: '2023-08-01', price: 44.1 },
        { date: '2023-09-01', price: 43.9 },
        { date: '2023-10-01', price: 44.5 },
        { date: '2023-11-01', price: 45.1 },
        { date: '2023-12-01', price: 45.5 },
      ],
      demandHistory: [
        { date: '2023-01-01', value: 65 },
        { date: '2023-02-01', value: 68 },
        { date: '2023-03-01', value: 70 },
        { date: '2023-04-01', value: 72 },
        { date: '2023-05-01', value: 75 },
        { date: '2023-06-01', value: 78 },
        { date: '2023-07-01', value: 80 },
        { date: '2023-08-01', value: 82 },
        { date: '2023-09-01', value: 85 },
        { date: '2023-10-01', value: 88 },
        { date: '2023-11-01', value: 90 },
        { date: '2023-12-01', value: 92 },
      ],
    },
    {
      id: 2,
      name: 'Tomatoes',
      currentPrice: 120.75,
      priceUnit: 'KES/kg',
      priceChange: -2.8,
      demand: 'Medium',
      forecast: 'Prices expected to stabilize as new harvests reach the market',
      description:
        'Tomatoes are experiencing price fluctuations due to seasonal factors. Recent harvests have increased supply, causing a slight price drop.',
      image:
        'https://media.istockphoto.com/id/2171026469/photo/hands-harvesting-ripe-tomatoes-from-a-lush-green-plant.webp?a=1&b=1&s=612x612&w=0&k=20&c=xZhjumapLY9HMf1lgg2wSnA2hAnCX7l7UjrpM5DSmk0=',
      priceHistory: [
        { date: '2023-01-01', price: 110.2 },
        { date: '2023-02-01', price: 115.3 },
        { date: '2023-03-01', price: 125.1 },
        { date: '2023-04-01', price: 130.8 },
        { date: '2023-05-01', price: 135.5 },
        { date: '2023-06-01', price: 140.2 },
        { date: '2023-07-01', price: 138.8 },
        { date: '2023-08-01', price: 135.1 },
        { date: '2023-09-01', price: 130.9 },
        { date: '2023-10-01', price: 128.5 },
        { date: '2023-11-01', price: 124.1 },
        { date: '2023-12-01', price: 120.75 },
      ],
      demandHistory: [
        { date: '2023-01-01', value: 60 },
        { date: '2023-02-01', value: 65 },
        { date: '2023-03-01', value: 70 },
        { date: '2023-04-01', value: 75 },
        { date: '2023-05-01', value: 80 },
        { date: '2023-06-01', value: 78 },
        { date: '2023-07-01', value: 75 },
        { date: '2023-08-01', value: 72 },
        { date: '2023-09-01', value: 70 },
        { date: '2023-10-01', value: 68 },
        { date: '2023-11-01', value: 65 },
        { date: '2023-12-01', value: 63 },
      ],
    },
    {
      id: 3,
      name: 'Potatoes',
      currentPrice: 65.25,
      priceUnit: 'KES/kg',
      priceChange: 1.5,
      demand: 'High',
      forecast:
        'Steady demand expected with slight price increases due to transportation costs',
      description:
        'Potatoes remain a staple with consistent demand. Recent fuel price increases have affected transportation costs, leading to slight price increases.',
      image:
        'https://media.istockphoto.com/id/2094368094/photo/fresh-potatoes-just-coming-out-of-the-planting-fields-are-ready-for-distribution-after.webp?a=1&b=1&s=612x612&w=0&k=20&c=clkqH3aCabh5lGmpF1gy1uO0_8MvGl8eptHttxF-Y60=',
      priceHistory: [
        { date: '2023-01-01', price: 60.2 },
        { date: '2023-02-01', price: 61.3 },
        { date: '2023-03-01', price: 61.1 },
        { date: '2023-04-01', price: 62.8 },
        { date: '2023-05-01', price: 62.5 },
        { date: '2023-06-01', price: 63.2 },
        { date: '2023-07-01', price: 63.8 },
        { date: '2023-08-01', price: 64.1 },
        { date: '2023-09-01', price: 64.3 },
        { date: '2023-10-01', price: 64.5 },
        { date: '2023-11-01', price: 64.9 },
        { date: '2023-12-01', price: 65.25 },
      ],
      demandHistory: [
        { date: '2023-01-01', value: 75 },
        { date: '2023-02-01', value: 76 },
        { date: '2023-03-01', value: 77 },
        { date: '2023-04-01', value: 78 },
        { date: '2023-05-01', value: 79 },
        { date: '2023-06-01', value: 80 },
        { date: '2023-07-01', value: 81 },
        { date: '2023-08-01', value: 82 },
        { date: '2023-09-01', value: 83 },
        { date: '2023-10-01', value: 84 },
        { date: '2023-11-01', value: 85 },
        { date: '2023-12-01', value: 86 },
      ],
    },
    {
      id: 4,
      name: 'Milk',
      currentPrice: 70.0,
      priceUnit: 'KES/liter',
      priceChange: 8.3,
      demand: 'High',
      forecast:
        'Prices expected to remain high due to increased production costs and steady demand',
      description:
        'Dairy products are experiencing price increases due to higher feed costs and increased demand from processors.',
      image:
        'https://images.unsplash.com/photo-1573731541652-faf8035adb47?q=80&w=3433&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      priceHistory: [
        { date: '2023-01-01', price: 60.0 },
        { date: '2023-02-01', price: 61.5 },
        { date: '2023-03-01', price: 62.0 },
        { date: '2023-04-01', price: 63.5 },
        { date: '2023-05-01', price: 64.0 },
        { date: '2023-06-01', price: 65.5 },
        { date: '2023-07-01', price: 66.0 },
        { date: '2023-08-01', price: 67.5 },
        { date: '2023-09-01', price: 68.0 },
        { date: '2023-10-01', price: 68.5 },
        { date: '2023-11-01', price: 69.0 },
        { date: '2023-12-01', price: 70.0 },
      ],
      demandHistory: [
        { date: '2023-01-01', value: 80 },
        { date: '2023-02-01', value: 81 },
        { date: '2023-03-01', value: 82 },
        { date: '2023-04-01', value: 83 },
        { date: '2023-05-01', value: 84 },
        { date: '2023-06-01', value: 85 },
        { date: '2023-07-01', value: 86 },
        { date: '2023-08-01', value: 87 },
        { date: '2023-09-01', value: 88 },
        { date: '2023-10-01', value: 89 },
        { date: '2023-11-01', value: 90 },
        { date: '2023-12-01', value: 91 },
      ],
    },
    {
      id: 5,
      name: 'Beans',
      currentPrice: 110.5,
      priceUnit: 'KES/kg',
      priceChange: -1.2,
      demand: 'Medium',
      forecast:
        'Prices expected to decrease slightly as new harvests reach markets',
      description:
        'Bean prices are stabilizing after recent harvests. Good weather conditions have led to increased production in key growing regions.',
      image:
        'https://media.istockphoto.com/id/1372196138/photo/assorted-legumes-in-burlap-sacks-in-a-row-as-a-full-frame-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=T8M5cr_sVOpjEwqT6ImlXf7Z8_QgWkcH7ez7_gTwibo=',
      priceHistory: [
        { date: '2023-01-01', price: 105.2 },
        { date: '2023-02-01', price: 107.3 },
        { date: '2023-03-01', price: 109.1 },
        { date: '2023-04-01', price: 112.8 },
        { date: '2023-05-01', price: 115.5 },
        { date: '2023-06-01', price: 116.2 },
        { date: '2023-07-01', price: 115.8 },
        { date: '2023-08-01', price: 114.1 },
        { date: '2023-09-01', price: 113.9 },
        { date: '2023-10-01', price: 112.5 },
        { date: '2023-11-01', price: 111.8 },
        { date: '2023-12-01', price: 110.5 },
      ],
      demandHistory: [
        { date: '2023-01-01', value: 70 },
        { date: '2023-02-01', value: 72 },
        { date: '2023-03-01', value: 74 },
        { date: '2023-04-01', value: 76 },
        { date: '2023-05-01', value: 78 },
        { date: '2023-06-01', value: 77 },
        { date: '2023-07-01', value: 76 },
        { date: '2023-08-01', value: 75 },
        { date: '2023-09-01', value: 74 },
        { date: '2023-10-01', value: 73 },
        { date: '2023-11-01', value: 72 },
        { date: '2023-12-01', value: 71 },
      ],
    },
  ];

  constructor() {}

  getMarketProducts(): Observable<MarketProduct[]> {
    return of(this.mockProducts);
  }

  getProductById(id: number): Observable<MarketProduct | undefined> {
    const product = this.mockProducts.find((p) => p.id === id);
    return of(product);
  }
}
