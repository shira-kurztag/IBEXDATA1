import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentDetailsByTenantComponent } from './apartment-details-by-tenant.component';

describe('ApartmentDetailsByTenantComponent', () => {
  let component: ApartmentDetailsByTenantComponent;
  let fixture: ComponentFixture<ApartmentDetailsByTenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApartmentDetailsByTenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApartmentDetailsByTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
