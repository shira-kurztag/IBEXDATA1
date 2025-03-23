import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenantComponent } from './maintenant.component';

describe('MaintenantComponent', () => {
  let component: MaintenantComponent;
  let fixture: ComponentFixture<MaintenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
