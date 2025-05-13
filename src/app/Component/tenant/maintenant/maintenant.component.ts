import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TenantService } from '../../../service/tenant.service';
import { getIdentityTypeString, IdentityType } from '../../../Models/IdentityType.enum';
import { getTenantStatusString, TenantStatus } from '../../../Models/TenantStatus.enum';
import { OwnerdetailsComponent } from '../../detailsApartment/ownerdetails/ownerdetails.component';

@Component({
  selector: 'app-tenant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule,OwnerdetailsComponent  ],
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
  activeComponent: string = ''; // מצב ברירת מחדל - לא מוצגת קומפוננטה

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
    this.apartmentId = 9987; // מזהה דירה זמני
    this.getTenants();
  }

  get tenants(): FormArray {
    return this.tenantForm.get('tenants') as FormArray;
  }

  createTenantGroup(tenant: any): FormGroup {
    return this.fb.group({
      tenantId: [tenant.tenantId|| 0], // מספר
      ApartmentId: [this.apartmentId || 0], // מספר
      tenantStatus: [tenant.tenantStatus || 0], // מספר
      firstName: [tenant.firstName || ''], // מחרוזת
      lastName: [tenant.lastName || ''], // מחרוזת
      tenantIdentity: [tenant.tenantIdentity || ''], // מחרוזת
      IdFileName: [tenant.idFileName || ''], // מחרוזת
      IdentityFromCountry: [tenant.identityFromCountry || ''], // מחרוזת
      USName: [tenant.usName || ''], // מחרוזת
      PreviousTenantId: [tenant.previousTenantId || 0], // מספר
      IdentityTypePrevious: [tenant.identityTypePrevious || 0], // מספר
      TenantIdentityPrevious: [tenant.tenantIdentityPrevious || ''], // מחרוזת
      OtherPrevious: [tenant.otherPrevious || ''], // מחרוזת
      IdentityType: [tenant.identityType || 0], // מספר
      partAsset: [tenant.partAsset || 0, [Validators.min(0)]], // מספר עם ולידציה
      isSignatureByPowerOfAttorney: [tenant.isSignatureByPowerOfAttorney || false], // בוליאני
      firstNamePower: [tenant.firstNamePower || ''], // מחרוזת
      lastNamePower: [tenant.lastNamePower || ''], // מחרוזת
      IdFileNamePower: [tenant.idFileNamePower || ''], // מחרוזת
      powerOfAttorneyId: [tenant.powerOfAttorneyId || ''], // מחרוזת
      PowerOfAttorneyType: [tenant.powerOfAttorneyType || 0], // מספר
      FileName: [tenant.fileName || ''], // מחרוזת
      FromDate: [tenant.fromDate || null], // תאריך
      address: [tenant.address || ''], // מחרוזת
      numberPhone: [tenant.numberPhone || ''], // מחרוזת
      numberPhone2: [tenant.numberPhone2 || ''], // מחרוזת
      powerId: [tenant.powerId || 0], // מספר
    });
  }

  getTenants(): void {
    this.srvTenant.GetTenantByApartment(this.apartmentId).subscribe((tenant: any[]) => {
      if (tenant) {
        this.tenants.clear();
        tenant.forEach((t) => this.tenants.push(this.createTenantGroup(t)));
        this.MessagePartAsset();
        console.log(tenant);
        
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
    const tenants = this.tenantForm.value.tenants; 
    console.log('Form Data:', tenants);
    // בדיקה אם חלק בנכס גדול מ-100
    this.MessagePartAsset();
   if( this.partAsset <= 100){
    // חזרה למצב תצוגה בלבד
    this.editMode = false; 
    // שליחת הנתונים לשרת
    this.srvTenant.UpdateTenants(tenants).subscribe(
      (response: any) => {
        console.log('Tenants updated:', response);
      },
      (error) => {
        console.error('Error updating tenants:', error);
        this.getTenants();
        alert('הייתה שגיאה בעת עדכון הנתונים.');
      }
    );

  }else{
      alert('חלק בנכס לא יכול להיות גדול מ-100%');
      this.Message = true; // הצגת הודעת שגיאה
  }
  }


  //פונקציה שבודקת את את חלק בנכס/ 
  // אם הוא גדול מ-100

  deleteTenant(id: number): void {
    console.log(id);

    if (confirm('האם אתה בטוח שברצונך למחוק את הפריט?')) {
      console.log(id);
      this.srvTenant.DeleteTenants(id).subscribe(
        (response: any) => {
          console.log('Tenants delete:', response);
          this.getTenants(); // רענון הרשימה לאחר מחיקה
        },
        (error) => {
          console.error('Error delete tenants:', error);
          this.getTenants(); // רענון הרשימה לאחר מחיקה
          alert('הייתה שגיאה בעת מחיקת הנתונים.');
        }
      );
    } else {
      console.log('המשתמש ביטל את המחיקה.');
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

  setActiveComponent(componentName: string): void {
    this.activeComponent = componentName;
  }
}