import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  standalone: true,
  selector: 'app-apartment',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    CalendarModule
  ],
  templateUrl: './apartment.component.html',
  styleUrl: './apartment.component.css'
})
export class ApartmentComponent {
  breadcrumbItems!: MenuItem[];
  apartmentForm: FormGroup;

  constructor(private fb: FormBuilder) {
 
    this.apartmentForm = this.fb.group({
      apartmentId: [0, Validators.required],
      buildingId: [null],
      apartmentStatus: [null, Validators.required],
      apartmentNumberByContract: [null, Validators.required],
      apartmentSurfaceByContract: [null],
      apartmentNumberByAddress: [null],
      isDetachedApartment: [false],
      isCompanyHasCompletedCommitments: [false, Validators.required],
      isGivenPossessionOfTheApartment: [false, Validators.required],
      isProducedLease: [false, Validators.required],
      note: [''],
      purchasDate: [null],
      insertDate: [null, Validators.required],
      updateDate: [null],
      floor: [null],
      apartmentOrShop: [null],
      numberOfLease: [null],
      addressByContract: [''],
      noteEdit: [''],
      noteEditStatus: [false],
      floorString: [''],
      hakiraFileName: [''],
      numberOfLeaseString: ['']
    });
  }

  onSubmit() {
    if (this.apartmentForm.valid) {
      console.log(this.apartmentForm.value);
    }
  }
  ngOnInit() {
   console.log("kkkkkkkkkk");
   
    this.breadcrumbItems = [
      { label: 'דף הבית', url: '/' },
      { label: 'רשימת בנקים', url: '/bank' }
    ];
  }

}
