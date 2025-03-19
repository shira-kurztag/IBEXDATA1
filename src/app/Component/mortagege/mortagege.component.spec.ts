import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MortagegeComponent } from './mortagege.component';

describe('MortagegeComponent', () => {
  let component: MortagegeComponent;
  let fixture: ComponentFixture<MortagegeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MortagegeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MortagegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
