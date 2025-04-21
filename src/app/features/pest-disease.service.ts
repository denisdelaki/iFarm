import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class PestDiseaseService {
  getPestDiseases(): Observable<PestDisease[]> {
    // Mock data with updated image URLs from open-access sources
    const pestDiseases: PestDisease[] = [
      {
        id: 1,
        name: 'Fall Armyworm',
        type: 'pest',
        category: 'plant',
        description:
          'A destructive pest that feeds on many crops, particularly maize.',
        affectedSpecies: ['Maize', 'Sorghum', 'Rice', 'Wheat'],
        seasons: ['Rainy', 'Summer'],
        regions: ['Western Kenya', 'Rift Valley', 'Nyanza'],
        symptoms: ['Leaf damage', 'Holes in leaves', 'Damaged crop ears'],
        preventionMethods: [
          'Early planting',
          'Crop rotation',
          'Use of resistant varieties',
        ],
        controlMethods: [
          'Biological control with natural enemies',
          'Targeted pesticide application',
          'Integrated Pest Management (IPM)',
        ],
        imageUrl:
          'https://media.istockphoto.com/id/2168702533/photo/in-the-maize-field-the-armyworm-attack-the-maize-leaves-causing-damage-to-the-maize-leaves.jpg?s=612x612&w=0&k=20&c=0RKQv53uIk4gLRfkXuxLEK5n17da9hiRvw5Y_MzcMJA=',
      },
      {
        id: 2,
        name: 'Coffee Leaf Rust',
        type: 'disease',
        category: 'plant',
        description:
          'A fungal disease affecting coffee plants, causing premature leaf drop and reduced yield.',
        affectedSpecies: ['Coffee'],
        seasons: ['Rainy'],
        regions: ['Central Kenya', 'Eastern Kenya'],
        symptoms: [
          'Yellow-orange lesions on leaves',
          'Premature leaf drop',
          'Reduced yield',
        ],
        preventionMethods: [
          'Proper spacing of plants',
          'Pruning to improve air circulation',
          'Resistant varieties',
        ],
        controlMethods: [
          'Fungicide application',
          'Removal of infected leaves',
          'Proper field sanitation',
        ],
        imageUrl:
          'https://media.istockphoto.com/id/1606106471/photo/organic-coffee-plant-with-green-red-and-yellow-beans.jpg?s=612x612&w=0&k=20&c=LI-F6dH00xRxlu833glXw4xugMyZfNcWPOxtnf_IevM=',
      },
      {
        id: 3,
        name: 'East Coast Fever',
        type: 'disease',
        category: 'animal',
        description:
          'A tick-borne disease affecting cattle, causing fever and high mortality.',
        affectedSpecies: ['Cattle'],
        seasons: ['All seasons'],
        regions: ['Coastal Kenya', 'Eastern Kenya', 'Central Kenya'],
        symptoms: [
          'High fever',
          'Swollen lymph nodes',
          'Difficulty breathing',
          'Loss of appetite',
        ],
        preventionMethods: [
          'Regular tick control',
          'Vaccination',
          'Rotational grazing',
        ],
        controlMethods: [
          'Early treatment with appropriate medication',
          'Supportive care',
          'Isolation of affected animals',
        ],
        imageUrl:
          'https://th.bing.com/th/id/OIP.ZaxtnZCGorKdSrTVAxgphQHaFj?rs=1&pid=ImgDetMain',
      },
      {
        id: 4,
        name: 'Tomato Blight',
        type: 'disease',
        category: 'plant',
        description:
          'A fungal disease affecting tomatoes, causing leaf spots and fruit rot.',
        affectedSpecies: ['Tomato', 'Potato'],
        seasons: ['Rainy', 'Summer'],
        regions: ['Central Kenya', 'Rift Valley', 'Western Kenya'],
        symptoms: ['Dark spots on leaves', 'Fruit rot', 'Wilting'],
        preventionMethods: [
          'Crop rotation',
          'Proper spacing',
          'Resistant varieties',
        ],
        controlMethods: [
          'Fungicide application',
          'Removal of infected plants',
          'Proper field sanitation',
        ],
        imageUrl:
          'https://media.istockphoto.com/id/886698440/photo/phytophthora-infestans-is-an-oomycete-that-causes-the-serious-tomatoes-disease-known-as-late.jpg?s=612x612&w=0&k=20&c=XZuObOJc3Calt-SlPTpoScN0VVk0gEbHDaKnB8nP-6Q=',
      },
      {
        id: 5,
        name: 'Ticks',
        type: 'pest',
        category: 'animal',
        description:
          'External parasites that feed on blood and can transmit diseases to livestock.',
        affectedSpecies: ['Cattle', 'Sheep', 'Goats', 'Dogs'],
        seasons: ['All seasons'],
        regions: ['All regions of Kenya'],
        symptoms: [
          'Visible ticks on animal body',
          'Anemia',
          'Weight loss',
          'Disease transmission',
        ],
        preventionMethods: [
          'Regular dipping/spraying',
          'Pasture management',
          'Rotational grazing',
        ],
        controlMethods: [
          'Acaricide application',
          'Manual removal',
          'Biological control',
        ],
        imageUrl:
          'https://th.bing.com/th/id/OIP.Ll3XjolOYFAl_YApSXUFUQHaEz?rs=1&pid=ImgDetMain',
      },
    ];

    return of(pestDiseases); // Simulate API call with Observable
  }
}
