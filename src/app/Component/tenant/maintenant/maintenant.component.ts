import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TenantService } from '../../../service/tenant.service';
import { getIdentityTypeString, IdentityType } from '../../../Models/IdentityType.enum';
import { getTenantStatusString, TenantStatus } from '../../../Models/TenantStatus.enum';

@Component({
  selector: 'app-tenant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './maintenant.component.html',
  styleUrls: ['./maintenant.component.css'],
  providers: [TenantService],
})
export class MainTenantComponent implements OnInit {
  tenantForm: FormGroup; // טופס ריאקטיבי
  apartmentId!: number;
  partAsset: number = 0;
  Message: boolean = false;
  editMode: boolean = false; // מצב עריכה - ברירת מחדל: תצוגה בלבד

  @Input() apartmentID!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.tenantForm = this.fb.group({
      tenants: this.fb.array([]),
    });
  }

  srvTenant: TenantService = inject(TenantService);

  ngOnInit(): void {
    this.apartmentId = 10032; // מזהה דירה זמני
    this.getTenants();
  }

  get tenants(): FormArray {
    return this.tenantForm.get('tenants') as FormArray;
  }

  createTenantGroup(tenant: any): FormGroup {
    return this.fb.group({
      tenantStatus: [tenant.tenantStatus || '', Validators.required],
      firstName: [tenant.firstName || '', Validators.required],
      lastName: [tenant.lastName || '', Validators.required],
      tenantIdentity: [tenant.tenantIdentity || '', Validators.required],
      partAsset: [tenant.partAsset || 0, [Validators.required, Validators.min(0)]],
      isSignatureByPowerOfAttorney: [tenant.isSignatureByPowerOfAttorney || false],
      firstNamePower: [tenant.firstNamePower || ''],
      lastNamePower: [tenant.lastNamePower || ''],
      powerOfAttorneyId: [tenant.powerOfAttorneyId || ''],
      address: [tenant.address || ''],
      numberPhone: [tenant.numberPhone || ''],
    });
  }

  getTenants(): void {
    this.srvTenant.GetTenantByApartment(this.apartmentId).subscribe((tenant: any[]) => {
      if (tenant) {
        this.tenants.clear();
        tenant.forEach((t) => this.tenants.push(this.createTenantGroup(t)));
        this.MessagePartAsset();
      }
    });
  }

  MessagePartAsset(): void {
    this.partAsset = 0;
    this.tenants.controls.forEach((control) => {
      this.partAsset += control.get('partAsset')?.value || 0;
    });
    this.Message = this.partAsset < 100;
  }

  saveChanges(): void {
    if (this.tenantForm.valid) {
      console.log('Form Data:', this.tenantForm.value);
      this.editMode = false; // חזרה לתצוגה בלבד אחרי שמירה
    } else {
      alert('נא למלא את כל השדות הנדרשים!');
    }
  }

  toggleEdit(): void {
    this.editMode = true; // מעבר למצב עריכה
  }

  cancelEdit(): void {
    this.editMode = false; // חזרה למצב תצוגה בלבד
  }

  trackByTenantId(index: number, item: any): number {
    return item.id;
  }

  getIdentityTypeString(type: IdentityType): string {
    return getIdentityTypeString(type);
  }

  getTenantStatusString(status: TenantStatus): string {
    return getTenantStatusString(status);
  }
}