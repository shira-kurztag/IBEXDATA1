import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentHomePageComponent } from './apartment-home-page.component';

describe('ApartmentHomePageComponent', () => {
  let component: ApartmentHomePageComponent;
  let fixture: ComponentFixture<ApartmentHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApartmentHomePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApartmentHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
