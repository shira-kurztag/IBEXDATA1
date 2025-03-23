import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcontractorComponent } from './addcontractor.component';

describe('AddcontractorComponent', () => {
  let component: AddcontractorComponent;
  let fixture: ComponentFixture<AddcontractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddcontractorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddcontractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
