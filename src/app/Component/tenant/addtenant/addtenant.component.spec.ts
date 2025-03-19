import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtenantComponent } from './addtenant.component';

describe('AddtenantComponent', () => {
  let component: AddtenantComponent;
  let fixture: ComponentFixture<AddtenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddtenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddtenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
