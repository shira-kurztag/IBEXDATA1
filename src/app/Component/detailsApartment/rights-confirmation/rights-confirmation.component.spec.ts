import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightsConfirmationComponent } from './rights-confirmation.component';

describe('RightsConfirmationComponent', () => {
  let component: RightsConfirmationComponent;
  let fixture: ComponentFixture<RightsConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightsConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightsConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
