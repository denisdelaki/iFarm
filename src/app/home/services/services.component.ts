import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services',
  imports: [
    CommonModule
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  public services: any[] = [
    {
      title: 'Real time Weather Forecast',
      description: 'Our real-time weather forecast service provides up-to-the-minute weather information, including current conditions and forecasts for the next 7 days. We use advanced technologies such as radar and satellite data to deliver accurate and reliable weather updates, helping you plan your day with confidence.',
      imageUrl: 'https://media.istockphoto.com/id/1176320050/photo/weather-forecast-on-a-digital-display-7-day-dashboard-3d-illustration.webp?a=1&b=1&s=612x612&w=0&k=20&c=flRnDlEGo1kitHSL9IUd_StQXczbtQT6MH1hYXGens0='
    },
    {
      title: 'Market Analysis and price updates',
      description: 'Our market analysis and price updates service provides comprehensive insights into market trends and real-time price information for a wide range of assets. Our expert analysts deliver in-depth reports and up-to-the-minute data, empowering you to make informed decisions and stay ahead in the competitive landscape.',
      imageUrl: 'https://media.istockphoto.com/id/2007398242/photo/businessman-uses-computer-with-pen-financial-graph-analysis-concepts-stock-market-information.webp?a=1&b=1&s=612x612&w=0&k=20&c=BVxvDOf3jtP8pstVtqLoc5Ggmr95fA_uY0DMCWegT9c='
    },
    {
      title: 'Pest and Disease Monitoring',
      description: 'Our pest and disease monitoring service provides real-time information on the presence and spread of various pests and diseases. By using advanced monitoring techniques and data analytics, we help you detect and manage pests effectively, protecting your crops and promote sustainable agriculture.',
      imageUrl: 'https://media.istockphoto.com/id/1756270637/photo/a-head-of-cabbage-in-a-garden-bed-damaged-by-insect-pests.webp?a=1&b=1&s=612x612&w=0&k=20&c=8Uxx8MMvX_Si6QgFlQTedV4RJnLbHXMAUyPQBTB4qiw='
    }
  ]
  constructor() { }

  ngOnInit() { }
}
