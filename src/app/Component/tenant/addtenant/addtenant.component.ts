import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { getTenantStatusString, TenantStatus } from '../../../Models/TenantStatus.enum';


@Component({
  selector: 'app-addtenant',
  imports: [ReactiveFormsModule, CardModule, ButtonModule, InputTextModule, CommonModule, RadioButtonModule, ToggleSwitchModule, DropdownModule, HttpClientModule],
  standalone: true,    // חייב להיות true
  templateUrl: './addtenant.component.html',
  styleUrl: './addtenant.component.css',
  providers: [TenantService, ApartmentService]
})
export class AddTenantComponent implements OnInit {
  TenantDTO: FormGroup[] = [];
  identityTypes!: any[];
  IdentityTypePrevious!: any[];
  PowerOfAttorneyType!: any[];
  srvTenant: TenantService = inject(TenantService);
  srvApartment: ApartmentService = inject(ApartmentService);
  clickCount = 0; // מונה לחיצות על כפתור הוספת דייר
  errorMessage: string = '';
  isSaved: boolean = false;
  isAdd: boolean = false;
  buttonText: string = 'הוסף בעלים';
  apartmentId!: number;
  powerDetailsCopied :boolean = false;



  constructor(private fb: FormBuilder, private TenantService: TenantService, private router: Router) { }


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
      { label: 'נוטריוני ', value: 5 },
      { label: 'קונטרולר', value: 6 },
    ];


    this.TenantDTO.forEach(tenantForm => this.listenToPowerOfAttorneyChanges(tenantForm));
    const raw = localStorage.getItem('apartmentId');
    if (raw !== null) {
      const apartmentId: number = parseInt(raw, 10);
      console.log('ID שהתקבל:', apartmentId);
    }
      localStorage.removeItem('apartmentId');

  }

    createTenantForm(): void {
      this.isAdd = true;
      const tenantForm = this.fb.group({
        LastName: ['', [Validators.pattern(/^[א-תa-zA-Z]+$/)]],
        FirstName: ['', [Validators.pattern(/^[א-תa-zA-Z]+$/)]],
        TenantIdentity: ['', [Validators.pattern(/^[a-zA-Z0-9]+$/)]],
        IdentityType: [null],
        TenantStatus: [1],
        IdFileName: [''],
        IdentityFromCountry: [''],
        USName: [''],
        PreviousTenantId: [0],
        IdentityTypePrevious: [Number],
        TenantIdentityPrevious: [''],
        OtherPrevious: [''],
        IsSignatureByPowerOfAttorney: [false],
        PowerOfAttorneyId: [''],
        LastNamePower: ['', [Validators.pattern(/^[א-תa-zA-Z]+$/)]],
        FirstNamePower: ['', [Validators.pattern(/^[א-תa-zA-Z]+$/)]],
        IdFileNamePower: [''],
        PowerOfAttorneyType: [null],
        FromDate: [null],
        FileName: [''],
        Address: [''],
        NumberPhone: ['', [Validators.pattern(/^[0-9]{7,10}$/)]],
        NumberPhone2: ['', [Validators.pattern(/^[0-9]{7,10}$/)]],
        PartAsset: [null, [Validators.min(0), Validators.max(100)]],
        ApartmentId: [10032],
      });
      this.TenantDTO.push(tenantForm);
      this.listenToPowerOfAttorneyChanges(tenantForm);

      if(
        this.TenantDTO.length >= 2 && // רק מהפעם השנייה
          this.TenantDTO[0]?.get('IsSignatureByPowerOfAttorney')?.value === true && // התנאי הראשון (טופס ראשון)
          this.TenantDTO[this.TenantDTO.length - 1]?.get('IsSignatureByPowerOfAttorney')?.value === true // התנאי השני (טופס אחרון)
    ) {
      this.CopyofPowerOfAttorneyDetails();
    }
    this.clickCount++; // הגדלת מונה הלחיצות

    this.toggleButtonText();
  }
  deleteTenantForm(index: number): void {
    this.TenantDTO.splice(index, 1);
    this.toggleButtonText();
    this.clickCount--; // הגדלת מונה הלחיצות

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
  private updatePowerOfAttorneyType() {

    for (let index = 0; index < this.TenantDTO.length; index++) {
      const powerOfAttorneyType = this.TenantDTO[index].get('PowerOfAttorneyType');
      const _PreviousTenantId = this.TenantDTO[index].get('PreviousTenantId');

      if (powerOfAttorneyType) {
        if (powerOfAttorneyType.value === 5) {
          powerOfAttorneyType.setValue(1); // עדכון הערך ל-1
        }
        if (powerOfAttorneyType.value === 6) {
          powerOfAttorneyType.setValue(2); // עדכון הערך ל-2
        }
      }
      if (_PreviousTenantId) {
        if (_PreviousTenantId.value === true) {
          _PreviousTenantId.setValue(0); // עדכון הערך ל-1
        }
        if (_PreviousTenantId.value === false) {
          _PreviousTenantId.setValue(1); // עדכון הערך ל-2
        }
      }

    }
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
    console.log('_PreviousTenantId:', this.TenantDTO[0].value.IdentityTypePrevious); // בדוק את הערך הספציפי
    // בדיקה אם כל הטפסים תקינים
    if (this.TenantDTO.every(form => form.valid)) {
      const tenantForm = this.TenantDTO[0];
      console.log(tenantForm.value);
      const t = tenantForm.value;
      console.log("vvv" + t.ApartmentId);
      const apartmentId = 10032;
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
          console.log("---------------"); // בדוק את כל הערכים
          console.log('_PreviousTenantId:', this.TenantDTO[0].value.IdentityTypePrevious.value); // בדוק את הערך הספציפי
          this.updatePowerOfAttorneyType();
          // עדכון תאריכים לפני שליחה לשרת
          this.updateProjectDates();
          console.log("---------------"); // בדוק את כל הערכים
          const tenants: TenantDTO[] = this.TenantDTO.map(form => form.value);
          console.log(tenants[0].ApartmentId);
          console.log('Tenants:', tenants); // בדוק את כל הערכים
          console.log('IdentityType:', tenants[0].IdentityType); // בדוק את הערך הספציפי
          console.log('PowerOfAttorneyType:', tenants[0].PowerOfAttorneyType); // בדוק את הערך הספציפי
          console.log('_PreviousTenantId:', tenants[0].PreviousTenantId); // בדוק את הערך הספציפי
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
    this.toggleButtonText();
      this.router.navigate(
    ['/detailsApartment'],

  );
    
  }

  getTenantStatusString(status: TenantStatus): string {
    return getTenantStatusString(status);
  }
  CopyofPowerOfAttorneyDetails() {
    if (
      this.TenantDTO[this.TenantDTO.length - 1].get('IsSignatureByPowerOfAttorney')?.value === true && // הטופס האחרון
      this.TenantDTO.length >= 2 // חייבים לפחות שני טפסים
    ) {
      if (this.TenantDTO[0].get('IsSignatureByPowerOfAttorney')?.value === true) {
        const firstTenant = this.TenantDTO[0]; // קבלת הטופס הראשון במערך
        const firstName = firstTenant.get('FirstName')?.value || '';
        const lastName = firstTenant.get('LastName')?.value || '';

        // הצגת ההודעה עם שם הדייר
        const userResponse = window.confirm(
          `בדייר ${firstName} ${lastName} הוזנו פרטי מיופה כח. האם מיופה הכח הוא גם עבור הדייר הזה?`
        );
        if (userResponse) {
          const firstTenantForm = this.TenantDTO[0]; // הטופס הראשון
          const lastTenantForm = this.TenantDTO[this.TenantDTO.length - 1]; // הטופס האחרון

          // העתקת הנתונים מהטופס הראשון לטופס האחרון
          lastTenantForm.patchValue({
            PowerOfAttorneyId: firstTenantForm.get('PowerOfAttorneyId')?.value,
            LastNamePower: firstTenantForm.get('LastNamePower')?.value,
            FirstNamePower: firstTenantForm.get('FirstNamePower')?.value,
            IdFileNamePower: firstTenantForm.get('IdFileNamePower')?.value,
            PowerOfAttorneyType: firstTenantForm.get('PowerOfAttorneyType')?.value,
            FromDate: firstTenantForm.get('FromDate')?.value,
            FileName: firstTenantForm.get('FileName')?.value,
            Address: firstTenantForm.get('Address')?.value,
            NumberPhone: firstTenantForm.get('NumberPhone')?.value,
            NumberPhone2: firstTenantForm.get('NumberPhone2')?.value,
          });

          // הדפסת הנתונים בקונסול לבדיקה
          console.log('נוטריון הועתק לטופס האחרון:', lastTenantForm.value);
           this.powerDetailsCopied = true;           // נדע ש”העתקנו”
  this.setPowerFieldsDisabled(true);
        }
      }
    }

  }
  toggleButtonText() {
    if (this.TenantDTO.length > 0) {
      this.buttonText = 'הוסף דייר';
    } if (this.TenantDTO.length == 0) {
      this.buttonText = 'הוסף בעלים';
    }
  }

  private listenToPowerOfAttorneyChanges(tenantForm: FormGroup): void {
    const isSignatureControl = tenantForm.get('IsSignatureByPowerOfAttorney');
    if (isSignatureControl) {
      isSignatureControl.valueChanges.subscribe((newValue: boolean | null) => {
        if (newValue === true) {
          this.CopyofPowerOfAttorneyDetails();
        }
      });
    }
  }




private setPowerFieldsDisabled(disabled: boolean) {
  // נניח שהטפסים שלך הם מערך formGroups בשם TenantDTO
  const lastForm = this.TenantDTO[this.TenantDTO.length - 1];

  // הרשימה של כל השדות שרוצים לנעול
  const fields = [
    'PowerOfAttorneyId',
    'FirstNamePower',
    'LastNamePower',
    'IdFileNamePower',
    'PowerOfAttorneyType',
    'FromDate',
    'FileName',
    'Address',
    'NumberPhone',
    'NumberPhone2'
  ];

  for (const name of fields) {
    const ctrl = lastForm.get(name);
    if (disabled) ctrl?.disable({ emitEvent: false });
    else          ctrl?.enable({ emitEvent: false });
  }
}
releasePowerOfAttorneyDetails() {
  this.powerDetailsCopied = false;          // סימון שלא נעול
  this.setPowerFieldsDisabled(false);       // פותח חזרה את השדות
}


}
