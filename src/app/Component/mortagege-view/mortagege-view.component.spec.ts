import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MortagegeViewComponent } from './mortagege-view.component';

describe('MortagegeViewComponent', () => {
  let component: MortagegeViewComponent;
  let fixture: ComponentFixture<MortagegeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MortagegeViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MortagegeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
