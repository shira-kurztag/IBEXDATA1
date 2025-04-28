import { Mortagege } from '../../Models/Mortagege.model';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { PanelModule } from 'primeng/panel';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToggleSwitch, ToggleSwitchModule } from 'primeng/toggleswitch';
import { MortagegeService } from '../../service/mortagege.service';
import { MortagegesTypes } from '../../Models/MortagegesTypes.model';
import { MortagegeLevels } from '../../Models/MortagegeLevels.model';
import { CurrencyType } from '../../Models/CurrencyType.model';
import { BankService } from '../../service/bank.service';
import { Bank } from '../../Models/Bank.model';
import { Owner } from '../../Models/Owner.model';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { Tenant } from '../../Models/Tenant.model';
import { OwnerService } from '../../service/owner.service';
import { getMortgageStatusString, MortgageStatus } from '../../Models/MortgageStatus.enum';
import { InputSwitchModule } from 'primeng/inputswitch';
@Component({
  selector: 'app-mortagege',
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    HttpClientModule,
    ToggleSwitchModule,
    CheckboxModule,
    ButtonModule,
    DialogModule,
    Dialog, ButtonModule
    , FormsModule, ToggleSwitch,InputSwitchModule

  ],

  templateUrl: './mortagege.component.html',
  styleUrl: './mortagege.component.css',
  providers: [MortagegeService]
})
export class MortagegeComponent {
  constructor( private fb: FormBuilder) { }
  mortgageForm!: FormGroup;
  MortagegeId: number = 0;
  selectedMortagegesType: MortagegesTypes | null = null;
  mortagegesTypes: MortagegesTypes[] = [];
  selectedBankName!: Bank;
  IsDocumentApproved: boolean = false;//db-IsDocumentApproved
  apartmentId: number = 9983; // לשנות מקבל מקומפוננטה האבא ב url 
  borrowerOptions: { label: string, value: string }[] = [
    { label: 'כל בעלי זכויות', value: 'all' }
  ];

  unlimitedAmountOptions: { label: string, value: string }[] = [
    { label: '  סכום  ', value: 'Amount' },
    { label: 'ללא הגבלת סכום', value: 'NoAmountLimit' }];
  listBanks: Bank[] = [];
  listMortagegeLevels: MortagegeLevels[] = [];
  selectedRank?: MortagegeLevels
  selectedunlimitedAmount: { label: string, value: string } | null = this.unlimitedAmountOptions[0];
  borrowerName: string = '';
  commitmentAmount?: number;
  selectedCurrencyType?: CurrencyType;
  listCurrencyType: CurrencyType[] = [];
  unlimitedAmount: boolean = false;
   irrevocableInstructions: boolean = false;
   additionalNote: string = '';
  showErrors: boolean = false;
  ownersTenant: Tenant[] = []
  savedMortagege: Mortagege = {
    isApprovalCompany: false // אתחול השדות הנדרשים
  };
  srvMortagege: MortagegeService = inject(MortagegeService);
  srvOwner: OwnerService = inject(OwnerService);
  srvBank: BankService = inject(BankService);
  router: Router = inject(Router);
  displayErrorDialog: boolean = false; // משתנה לשליטה בהצגת הדיאלוג
  errorDialogMessage: string = '';
initializeForm() {
  this.mortgageForm = this.fb.group({
    mortagegeStatus: [-1],
    mortagegesType: [null, Validators.required], // סוג המשכנתא
    toTheBank: [null, Validators.required], // שם הבנק
    TeanantId: [[]], // מי נוטל המשכנתא
    // selectedunlimitedAmount: [null], // סוג הסכום
    amountType: [1], // סוג המטבע
    amount: [null, Validators.min(0)], // סכום המשכנתאcommitmentAmount 
    noteOrConditioning: [null], // הערות או התניות
    isDocumentApproved: [false], // האם מסמך מאושר
    isValidDocument: [false], // האם המסמך תקין
    sourceDocument: [false], // האם מדובר במסמך מקור
    levelMortagege: [null], // מאיזו דרגה
    irrevocableInstructions: [false], // האם נחתמו הוראות בלתי חוזרות
    isApprovalCompany: [false], // אישור החברה
    note: [null] ,// הערות נוספות,
    isAllTenantlpprovat:[false]
  });
}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
    
      console.log(`Selected file: ${file.name}`);
    }
  }
  booolSave: boolean=false;
  saveAndSend(){
    this.booolSave=true;
  }
  ngOnInit(): void {
    this.initializeForm();
    this.srvMortagege.GetAllMortagegesTypes().subscribe(response => {
      const mortagegesTypes = response ? (response as any)?.$values || response : [];

      this.mortagegesTypes = mortagegesTypes;
      this.selectedMortagegesType = this.mortagegesTypes.length > 0 ? this.mortagegesTypes[0] : null;
    });


    this.srvMortagege.GetAllCurrencyTypes().subscribe(response => {

      const currencyTypes = response ? (response as any)?.$values || response : [];
      if (Array.isArray(currencyTypes)) {
        this.listCurrencyType = currencyTypes;
      } else {
        this.listCurrencyType = [];
      }
      if (this.listCurrencyType.length > 0) {
        this.selectedCurrencyType = this.listCurrencyType[0];
      }

    });

    this.srvMortagege.GetAllMortagegeLevels().subscribe(response => {
      
      const MortagegeLevels = response ? (response as any)?.$values || response : [];
      if (Array.isArray(MortagegeLevels)) {
        this.listMortagegeLevels = MortagegeLevels;
        console.log(this.listMortagegeLevels);
        
      } 
      else {
        this.listMortagegeLevels = [];
      }
    });

    this.srvBank.GetAll().subscribe(response => {
      const banks = response ? (response as any)?.$values || response : [];
      this.listBanks = banks;
    });


    this.srvOwner.GetOwnersByApartmentId(this.apartmentId).subscribe(response => {

      const tenants = this.resolveReferences(response);
      this.ownersTenant = tenants ? (tenants as any)?.$values || tenants : [];
      this.updateBorrowerOptions();
    });
  }

  resolveReferences(obj: any): any {
    const map = new Map();
    const resolve = (item: any) => {
      if (item && typeof item === 'object') {
        if (item.$ref) {
          return map.get(item.$ref);
        }
        const id = item.$id;
        if (id) {
          map.set(id, item);
        }
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            item[key] = resolve(item[key]);
          }
        }
      }
      return item;
    };
    return resolve(obj);
  }
  showAdditionalQuestion = false; // משתנה לשליטה על תצוגת השאלה הנוספת
  // allRightsIncluded: string = '';

  onBorrowerChange(event: any): void {
    const selectedValue = event.value;
console.log(selectedValue);
console.log(this.borrowerOptions.length );

    // בדיקה אם הערך שנבחר אינו 'כל בעלי הזכויות'
    if (selectedValue.value !== 'all' && this.borrowerOptions.length > 2) {
      this.showAdditionalQuestion = true; // מציגים את השאלה הנוספת
    } else {
      this.showAdditionalQuestion = false; // מסתירים את השאלה הנוספת
    }
  }
  updateBorrowerOptions(): void {

    if (!Array.isArray(this.ownersTenant)) {
      console.error('ownersTenant is not an array:', this.ownersTenant);
      return;
    }
    this.borrowerOptions = [
      { label: 'כל בעלי זכויות', value: 'all' },
      ...this.ownersTenant.map(tenant => ({
        label: `${tenant.firstName || ''} ${tenant.lastName || ''}`,
        value: tenant.tenantId !== undefined ? tenant.tenantId.toString() : ''
      }))
    ];
  }
 
  generateIrrevocableInstructions() {

    if (this. mortgageForm.get('levelMortagege')?.value==null) {
   
      this.displayErrorDialog = true; // הצגת הדיאלוג במקרה של שגיאה
      this.errorDialogMessage = 'לא ניתן להפיק טופס הוראות בלתי חוזרות כיון שלא נבחרה דרגה למשכנתא';
    } else {
      // Add logic to generate irrevocable instructions content
    }
  }
  // statuses = MortgageStatus;

  // פונקציה להמיר את הערך הטכני של הסטטוס לתיאור מה-ENUM
  getStatusDescription(status: number): string {
    return getMortgageStatusString(status);
  }

  onSelectMortagegesType(event: any): void {
    this.selectedMortagegesType = event.value;
  }

  cancel() {
    // this.router.navigate(['/parent-page']);
    // יש לעבור לקומפוננטת האב
  }

  save() {
    this.mortgageForm.patchValue({ mortagegeStatus: 1 });
// this.mortgageForm.value.mortagegeStatus=1;
       if (this.mortgageForm.value. toTheBank && this.mortgageForm.value.mortagegesType)
        { 
      this.showErrors = false;
      const formValue = this.mortgageForm.value;
      formValue.mortagegesType=   this. mortgageForm.get('mortagegesType')?.value.mortagegesTypeId
      formValue.toTheBank=   this. mortgageForm.get('toTheBank')?.value.bankId
      console.log(formValue);
     
      this.srvMortagege.CreateMortagege(formValue).subscribe(response => {
      this.MortagegeId = response.id
        console.log('Mortgage created successfully:', response);
      }, error => {
        this.MortagegeId = error
        console.error('Error creating mortgage:',error);
      });
    }
    else {
      this.showErrors = true;
    }

  }

  saveAll() {
    if (this.mortgageForm.invalid) {
      console.error('Form is invalid:', this.mortgageForm.errors);

      this.mortgageForm.markAllAsTouched(); // מסמן את כל השדות כ"שנגעו בהם" כדי להציג שגיאות
      return;
    }
    const formValue = this.mortgageForm.value;
    formValue.mortagegesType=   this. mortgageForm.get('mortagegesType')?.value.mortagegesTypeId
    formValue.toTheBank=   this. mortgageForm.get('toTheBank')?.value.bankId
    formValue.levelMortagege=   this. mortgageForm.get('levelMortagege')?.value
    // formValue.levelMortagege=   this. mortgageForm.get('levelMortagege')?.value.mortagegeLevelId
    console.log(this.selectedunlimitedAmount);
    
    // if(this.selectedunlimitedAmount?.value=="NoAmountLimit")
    formValue.amountType =   this. mortgageForm.get('amountType')?.value

    
//  let borrowerValue = formValue.TeanantId.label!== 'all' ? Number(formValue.TeanantId. value  ) : this.ownersTenant.map(owner => owner.tenantId );
let borrowerValue: number[];

// בדיקה האם נבחר "all" או דייר ספציפי
if (formValue.TeanantId.value !== 'all') {
  // אם נבחר דייר ספציפי, המרה למספר והכנסתו לרשימה
  const singleValue = Number(formValue.TeanantId);
  if (!isNaN(singleValue)) {
    borrowerValue = [singleValue]; // הכנס ערך בודד לתוך רשימה
  } else {
    console.error('Invalid TeanantId value:', formValue.TeanantId.value);
    borrowerValue = []; // במקרה של שגיאה, החזר רשימה ריקה
  }
} else {
  // אם נבחר "all", החזר את כל בעלי הזכויות כרשימה
  borrowerValue = this.ownersTenant.map(owner => owner.tenantId);
}

// עדכון הערך בתוך formValue
formValue.TeanantId = borrowerValue;
if(this.selectedunlimitedAmount?.value=="NoAmountLimit")
{ console.log("NoAmountLimit");

   formValue.amountType= -1;
}

    this.srvMortagege.savedFullMortagege(formValue, this.MortagegeId).subscribe(
      (response: any) => {
        console.log('Mortgage created successfully:', response);
      },
      (error: any) => {
        console.error('Error creating mortgage:', error);
      } );
   
  
}

}
