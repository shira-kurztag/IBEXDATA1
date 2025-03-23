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


@Component({
  selector: 'app-addtenant',
  imports: [ReactiveFormsModule, CardModule, ButtonModule, InputTextModule, CommonModule, RadioButtonModule, ToggleSwitchModule, DropdownModule,HttpClientModule ],
  templateUrl: './addtenant.component.html',
  styleUrl: './addtenant.component.css',
  providers: [TenantService]
})
export class AddTenantComponent implements OnInit {
  tenantForms: FormGroup[] = [];
  identityTypes!: any[];
  IdentityType_previous!: any[];
  PowerOfAttorneyType!: any[];
  srvTenant: TenantService = inject(TenantService);
  errorMessage: string = '';
  isSaved: boolean = false;

  router: Router = inject(Router);  // errorMessage: string;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.identityTypes = [
      { label: 'ת.ז', value: 1 },
      { label: 'דרכון', value: 2 },
      { label: 'ר.מ.', value: 3 },
    ];

    this.IdentityType_previous = [
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

  addTenantForm(): void {
    const tenantForm = this.fb.group({
      TenantId: [Number],
      LastName: [''],
      FirstName: [''],
      TenantIdentity: [''],
      IdentityType: [''],
      TenantStatus: [1],
      IdFileName: [''],
      IdentityFromCountry: [''],
      USName: [''],
      previousTenantId: [false],
      IdentityType_previous: [Number],
      TenantIdentity_previous: [''],
      other_previous: [''],
      IsSignatureByPowerOfAttorney: [false],
      PartAsset: [Number],
      LastName_Power: [''],
      FirstName_Power: [''],
      PowerOfAttorneyId: [''],
      IdFileName_Power: [''],
      PowerOfAttorneyType: [''],
      FromDate: [Date],
      FileName: [''],
      Address: [''],
      NumberPhone: [''],
      NumberPhone2: ['']
    });
    this.tenantForms.push(tenantForm);
  }

  deleteTenantForm(index: number): void {
    this.tenantForms.splice(index, 1);
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
    this.tenantForms.forEach(form => {
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
    if (this.tenantForms.every(form => form.valid)) {
      let totalPartAsset = 0;
      for (const form of this.tenantForms) {
        const partAssetValue = form.get('PartAsset')?.value || 0;
        totalPartAsset += partAssetValue;
        if (partAssetValue > 100) {
          this.errorMessage = 'חלק בנכס לא יכול להיות גדול מ-100';
          form.get('PartAsset')?.setValue(0); // איפוס הערך של PartAsset
          return;
        }
      }

      if (totalPartAsset > 100) {
        this.errorMessage = 'סך חלק בנכס לא יכול להיות גדול מ-100';
        return;
      }

      // עדכון תאריכים לפני שליחה לשרת
      this.updateProjectDates();
      
      const tenants: any[] = this.tenantForms.map(form => form.value);
      this.srvTenant.addTenants(tenants).subscribe({
        next: () => {
          this.isSaved = true;
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          console.error('Error adding tenants:', error);
          this.errorMessage = 'Failed to add tenants. Please try again later.';
        }
      });
    }
  }
  cancel(): void {
    this.tenantForms.forEach(form => form.reset());
  }


}
