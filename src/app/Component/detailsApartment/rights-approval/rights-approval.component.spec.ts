import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightsApprovalComponent } from './rights-approval.component';

describe('RightsApprovalComponent', () => {
  let component: RightsApprovalComponent;
  let fixture: ComponentFixture<RightsApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightsApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightsApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
