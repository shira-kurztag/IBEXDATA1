import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListcontractorComponent } from './listcontractor.component';

describe('ListcontractorComponent', () => {
  let component: ListcontractorComponent;
  let fixture: ComponentFixture<ListcontractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListcontractorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListcontractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
