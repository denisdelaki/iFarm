import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PestDiseaseMonitorComponent } from './pest-disease-monitor.component';

describe('PestDiseaseMonitorComponent', () => {
  let component: PestDiseaseMonitorComponent;
  let fixture: ComponentFixture<PestDiseaseMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PestDiseaseMonitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PestDiseaseMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
