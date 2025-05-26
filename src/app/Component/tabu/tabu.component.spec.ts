import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabuComponent } from './tabu.component';

describe('TabuComponent', () => {
  let component: TabuComponent;
  let fixture: ComponentFixture<TabuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
