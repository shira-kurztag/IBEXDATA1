import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingApartmentComponent } from './adding-apartment.component';

describe('AddingApartmentComponent', () => {
  let component: AddingApartmentComponent;
  let fixture: ComponentFixture<AddingApartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddingApartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddingApartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
