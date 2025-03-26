import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { TenantService } from '../../../service/tenant.service';
import { ApartmentService } from '../../../service/apartment.service';
import { TenantDTO } from '../../../Models/TenantDTO.model';
import { catchError, of, switchMap } from 'rxjs';


@Component({
  selector: 'app-addtenant',
  imports: [ReactiveFormsModule , CardModule, ButtonModule, InputTextModule, CommonModule, RadioButtonModule, ToggleSwitchModule, DropdownModule,HttpClientModule ],
  templateUrl: './addtenant.component.html',
  styleUrl: './addtenant.component.css',
  providers: [TenantService,ApartmentService]
})
export class AddTenantComponent implements OnInit {
  TenantDTO: FormGroup[] = [];
  identityTypes!: any[];
  IdentityTypePrevious!: any[];
  PowerOfAttorneyType!: any[];
  srvTenant: TenantService = inject(TenantService);
  srvApartment: ApartmentService = inject(ApartmentService);

  errorMessage: string = '';
  isSaved: boolean = false;
  isAdd: boolean = false;

  router: Router = inject(Router);  // errorMessage: string;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.identityTypes = [
      { label: 'ת.ז', value: 1 },
      { label: 'דרכון', value: 2 },
      { label: 'ר.מ.', value: 3 }
    ];

    this.IdentityTypePrevious = [
      { label: 'ת.ז', value: 1 },
      { label: 'דרכון', value: 2 },
      { label: 'ר.מ.', value: 3 },
      { label: 'אחר', value: 4 },
    ];
    this.PowerOfAttorneyType = [
      { label: 'נוטריוני ', value: 1 },
      { label: 'קונטרולר', value: 2 },
    ];
  }

  createTenantForm(): void {
    this.isAdd=true;
    const tenantForm = this.fb.group({
      LastName: [''],
      FirstName: [''],
      TenantIdentity: [''],
      IdentityType: [null],
      TenantStatus: [1],
      IdFileName: [''],
      IdentityFromCountry: [''],
      USName: [''],
      previousTenantId: [0],
      IdentityTypePrevious: [null],
      TenantIdentityPrevious: [''],
      OtherPrevious: [''],
      IsSignatureByPowerOfAttorney: [false],
      PowerOfAttorneyId:[''],
      LastNamePower: [''],
      FirstNamePower: [''],
      IdFileNamePower: [''],
      PowerOfAttorneyType: [null],
      FromDate: [null],
      FileName: [''],
      Address: [''],
      NumberPhone: [''],
      NumberPhone2: [''],
      PartAsset:[Number],
      ApartmentId:[9998],
    });
    this.TenantDTO.push(tenantForm);

  }

  deleteTenantForm(index: number): void {
    this.TenantDTO.splice(index, 1);
  }

  private formatDate(date: any): string {
    if (!date) return ''; // בדיקה אם התאריך אינו תקף
    if (typeof date === 'string') {
      const [day, month, year] = date.split('-');
      date = new Date(`${year}-${month}-${day}`);
    }
    if (date.toString() === 'Invalid Date') return ''; // בדיקה אם התאריך אינו תקף לאחר ההמרה
    return date.toISOString().split('T')[0];
  }

  private updateProjectDates() {
    this.TenantDTO.forEach(form => {
      form.patchValue({
        dateWinningTender: this.formatDate(form.get('dateWinningTender')?.value),
        developmentPeriodEndDate: this.formatDate(form.get('developmentPeriodEndDate')?.value),
        collectionExpensesFrom1: this.formatDate(form.get('collectionExpensesFrom1')?.value),
        collectionExpensesFrom2: this.formatDate(form.get('collectionExpensesFrom2')?.value),
        collectionExpensesFrom3: this.formatDate(form.get('collectionExpensesFrom3')?.value),
        insertDate: this.formatDate(new Date()),
        updateDate: this.formatDate(new Date()),
        hachiraContractEndDate: this.formatDate(form.get('hachiraContractEndDate')?.value)
      });
    });
  }
  onSubmit(): void {
    // בדיקה אם כל הטפסים תקינים
    if (this.TenantDTO.every(form => form.valid)) {
      const tenantForm = this.TenantDTO[0];
      console.log(tenantForm.value);
      const t=tenantForm.value;
      console.log("vvv"+t.ApartmentId);
      

      const apartmentId = 9998;
      this.srvApartment.GetPartAssetApartmentID(apartmentId).pipe(
        switchMap((partAsset: number) => {
          let totalPartAsset = 0;
          totalPartAsset = partAsset;
          
          for (const form of this.TenantDTO) {
            const partAssetValue = form.get('PartAsset')?.value || 0;
            totalPartAsset += partAssetValue;
            console.log("pp" + totalPartAsset);
            
            if (partAssetValue > 100) {
              this.errorMessage = 'חלק בנכס לא יכול להיות גדול מ-100';
              form.get('PartAsset')?.setValue(0); // איפוס הערך של PartAsset
              return of(null); // חזרה לערך ריק כדי להפסיק את הזרימה
            }
          }
  
          if (totalPartAsset > 100) {
            this.errorMessage = 'סך חלק בנכס לא יכול להיות גדול מ-100';
            return of(null); // חזרה לערך ריק כדי להפסיק את הזרימה
          }
  
          // עדכון תאריכים לפני שליחה לשרת
          this.updateProjectDates();
          
          const tenants: TenantDTO[] = this.TenantDTO.map(form => form.value);
          console.log(tenants[0].ApartmentId);
          console.log('Tenants:', tenants); // בדוק את כל הערכים
          console.log('IdentityType:', tenants[0].IdentityType); // בדוק את הערך הספציפי
          console.log('PowerOfAttorneyType:', tenants[0].PowerOfAttorneyType); // בדוק את הערך הספציפי
  
          return this.srvTenant.addTenants(tenants);
        }),
        catchError((error: any) => {
          console.error('Error:', error);
          this.errorMessage = 'Failed to process the request. Please try again later.';
          return of(null); // חזרה לערך ריק כדי להפסיק את הזרימה
        })
      ).subscribe({
        next: (result) => {
          if (result) {
            console.log(" הצליח");
            this.isSaved = true;
            this.router.navigate(['/']);
          }
        },
        error: (error: any) => {
          console.error('Error adding tenants:', error);
          this.errorMessage = 'Failed to add tenants. Please try again later.';
        }
      });
    } else {
      this.errorMessage = 'Please ensure all forms are valid before submitting.';
    }
  }
  cancel(): void {
    this.TenantDTO.forEach(form => form.reset());
  }


}
