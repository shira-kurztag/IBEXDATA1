import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaincontractorComponent } from './maincontractor.component';

describe('MaincontractorComponent', () => {
  let component: MaincontractorComponent;
  let fixture: ComponentFixture<MaincontractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaincontractorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaincontractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
