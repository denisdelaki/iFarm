import { TestBed } from '@angular/core/testing';

import { PestDiseaseService } from './pest-disease.service';

describe('PestDiseaseService', () => {
  let service: PestDiseaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PestDiseaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
