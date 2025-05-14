import { Mortagege } from '../../Models/Mortagege.model';
import { Component, inject, numberAttribute, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { PanelModule } from 'primeng/panel';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
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
import { AdminApprovalComponent } from '../admin-approval/admin-approval.component';
import { CommentComponent } from '../comment/comment.component';
import { BankCertificate } from '../../Models/BankCertificate.model';
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
    , FormsModule, ToggleSwitch, InputSwitchModule,
    DialogModule,
    AdminApprovalComponent,
    CommentComponent

  ],

  templateUrl: './mortagege.component.html',
  styleUrl: './mortagege.component.css',
  providers: [MortagegeService]
})
export class MortagegeComponent {
  constructor(private fb: FormBuilder) { }
  mortgageForm!: FormGroup;
  MortagegeId: number = 0;
  selectedMortagegesType: MortagegesTypes | null = null;
  mortagegesTypes: MortagegesTypes[] = [];
  apartmentId: number = 9983; // לשנות מקבל מקומפוננטה האבא ב url 
  borrowerOptions: { label: string, value: number }[] = [
    { label: 'כל בעלי זכויות', value: -1 }
  ];

  unlimitedAmountOptions: { label: string, value: string }[] = [
    { label: '  סכום  ', value: 'Amount' },
    { label: 'ללא הגבלת סכום', value: 'NoAmountLimit' }];
  listBanks: Bank[] = [];
  listMortagegeLevels: MortagegeLevels[] = [];
  selectedRank?: MortagegeLevels
  selectedunlimitedAmount: { label: string, value: string } | null = this.unlimitedAmountOptions[0];
  borrowerName: string = '';
  selectedCurrencyType?: CurrencyType;
  listCurrencyType: CurrencyType[] = [];
  irrevocableInstructions: boolean = false;
  showErrors: boolean = false;
  ownersTenant: Tenant[] = []
  boolSave: boolean = false;
  visible: boolean = false;
  listOwnerOfmort: Owner[] = []
  listIdOwnerOfmort: number[] = []
  hasMortgageInProcess: boolean = false
  savedMortagege: Mortagege = {
    isApprovalCompany: false // אתחול השדות הנדרשים
  };
  commentText: string = "";
  srvMortagege: MortagegeService = inject(MortagegeService);
  srvOwner: OwnerService = inject(OwnerService);
  srvBank: BankService = inject(BankService);
  router: Router = inject(Router);
  displayErrorDialog: boolean = false;
  errorDialogMessage: string = '';


  isDocumentApproved: boolean = false; // האם מסמך מאושר
  
 // documentApproved//בהמשך נתעסק עם קבצים
 ///2-4
  // IsDocumentApprovedSource: boolean = false
  // IsDocumentApprovedValid: boolean = false
  //   level?: number
  ///
  listBankCertificate:BankCertificate[]=[]
    /////
  ListBanksForMortgages: number[] = []
  listBanksnameForMortgages: Bank[] = []
  initializeForm() {
    this.mortgageForm = this.fb.group({
      mortagegeStatus: [-1],
      mortagegesType: [null, Validators.required], // סוג המשכנתא
      toTheBank: [null, Validators.required], // שם הבנק
      TeanantId: [[]], // מי נוטל המשכנתא
      amountType: [1], // סוג המטבע
      amount: [null, Validators.min(0)], // סכום המשכנתאcommitmentAmount 
      noteOrConditioning: [null], // הערות או התניות
      isValidDocument: [false], // האם המסמך תקין
      sourceDocument: [false], // האם מדובר במסמך מקור
      levelMortagege: [null], // מאיזו דרגה
      irrevocableInstructions: [false], // האם נחתמו הוראות בלתי חוזרות
      isApprovalCompany: [false], // אישור החברה
      // note: [null] ,// הערות נוספות,
      isAllTenantlpprovat: [false]
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
         }
  }

  saveAndSend() {
    this.saveAll();
       if (this.hasMortgageInProcess) {
      this.commentText = "קיים תהליך קודם לנטילת משכנתא יש לסיימו או לבטלו בכדי לסיים הליך זה.";
    }
    this.commentText += "בקשה לאישור יצירת משכנתא";
    this.visible = true;
    this.boolSave = true;
  }

  closeAdminApprovalDialog() {
    this.boolSave = false;
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
    })



    this.srvMortagege.hasMortgageInProcess(this.apartmentId).subscribe(response => {
      this.hasMortgageInProcess = response
    })

    this.srvMortagege.GetAllMortgageBanksByApartment(this.apartmentId).subscribe(response => {

      this.ListBanksForMortgages = response

      const bankRequests = this.ListBanksForMortgages.map((bankId: number) =>
        this.srvBank.GetBankById(bankId).subscribe(response => {
          this.listBanksnameForMortgages.push(response);

          this.listBankCertificate = this.listBanksnameForMortgages.map(() => ({
            bankCertificatesId:0,
            isDocumentApproved: false,
            level: undefined,
            isDocumentApprovedSource: false,
            isDocumentApprovedValid: false,
         // documentApproved?: string;  
          }));
        })
      );
      debugger
   

      
    })
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


  showAdditionalQuestion = false;

  onBorrowerChange(event: any): void {
    const selectedValue = event.value;

    if (selectedValue.value !== -1 && this.borrowerOptions.length > 2) {
      this.showAdditionalQuestion = true;
    } else {
      this.showAdditionalQuestion = false;
    }
  }
  updateBorrowerOptions(): void {

    if (!Array.isArray(this.ownersTenant)) {
      console.error('ownersTenant is not an array:', this.ownersTenant);
      return;
    }
    this.borrowerOptions = [
      { label: 'כל בעלי זכויות', value: -1 },
      ...this.ownersTenant.map(tenant => ({
        label: `${tenant.firstName || ''} ${tenant.lastName || ''}`,

        value: tenant.tenantId !== undefined ? tenant.tenantId : -1
      }))
    ];
  }

  generateIrrevocableInstructions() {
    if (this.mortgageForm.get('levelMortagege')?.value == null) {
      this.displayErrorDialog = true;
      this.errorDialogMessage = 'לא ניתן להפיק טופס הוראות בלתי חוזרות כיון שלא נבחרה דרגה למשכנתא';
    } else {
      // Add logic to generate irrevocable instructions content
    }
  }

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
    if (this.mortgageForm.value.toTheBank && this.mortgageForm.value.mortagegesType) {
      this.showErrors = false;
      const formValue = this.mortgageForm.value;
      formValue.mortagegesType = this.mortgageForm.get('mortagegesType')?.value.mortagegesTypeId
      formValue.toTheBank = this.mortgageForm.get('toTheBank')?.value.bankId
      this.srvMortagege.CreateMortagege(formValue).subscribe(response => {
        this.MortagegeId = response.id



      }, error => {
        this.MortagegeId = error
        console.error('Error creating mortgage:', error);
      });
    }
    else {
      this.showErrors = true;
    }
  }

  saveAll() {
     const formValue = this.mortgageForm.value;
    formValue.mortagegesType = this.mortgageForm.get('mortagegesType')?.value.mortagegesTypeId
    formValue.toTheBank = this.mortgageForm.get('toTheBank')?.value.bankId
    formValue.levelMortagege = this.mortgageForm.get('levelMortagege')?.value?.mortagegeLevelId
    formValue.amountType = this.mortgageForm.get('amountType')?.value?.currencyTypeId
    let borrowerValue: number[];
    debugger

    if (formValue.TeanantId.value !== -1) {
      const singleValue = Number(formValue.TeanantId.value);
      if (!isNaN(singleValue)) {
        borrowerValue = [singleValue];
      } else {

        borrowerValue = [];
      }
    }
    else {
      debugger
      borrowerValue = this.ownersTenant.map(owner => owner.tenantId);
    }
    this.mortgageForm.patchValue({
      TeanantId: borrowerValue,
    });
    formValue.TeanantId = borrowerValue;

    if (this.selectedunlimitedAmount?.value == "NoAmountLimit") {
      formValue.amountType = -1;
    }

    this.srvMortagege.savedFullMortagege(formValue, this.MortagegeId).subscribe();
    this.saveBankCertificate();
    if(this.mortgageForm.get('mortagegesType')?.value.mortagegesTypeId === 2){
    this.updateListBankCertificate();
    }
  }

  saveBankCertificate() {

    this.srvOwner.GetAllOwnersByTenants(this.mortgageForm.get('TeanantId')?.value).subscribe((owners: Owner[]) => {



      this.listIdOwnerOfmort = owners
        .map(owner => owner.ownerId)
        .filter((id): id is number => id !== undefined);
      if (this.listIdOwnerOfmort.length != 0) {
        debugger
        this.listIdOwnerOfmort.forEach(ownerId => {
          const bankCertificate: BankCertificate = {
            bankCertificatesId: 0,
            mortgageId: this.MortagegeId,
            ownerId: ownerId,
            bankApproved: this.mortgageForm.get('toTheBank')?.value.bankId
          };

          this.srvMortagege.createBankCertificate(bankCertificate).subscribe( )
                   
        })

      }
      else {
        debugger
        const bankCertificate: BankCertificate = {
          bankCertificatesId: 0, // Or some default value if appropriate
          mortgageId: this.MortagegeId,
          ownerId: this.listIdOwnerOfmort[0],
          bankApproved: this.mortgageForm.get('toTheBank')?.value.bankId
        };


        this.srvMortagege.createBankCertificate(bankCertificate).subscribe(

          (id: number) => {
            if (this.listIdOwnerOfmort.length != 0) {
              this.listIdOwnerOfmort.forEach(ownerId => {
                const bankCertificate: BankCertificate = {
                  bankCertificatesId: 0,
                  mortgageId: this.MortagegeId,
                  ownerId: ownerId,
                  bankApproved: this.mortgageForm.get('toTheBank')?.value.bankId
                };

                this.srvMortagege.createBankCertificate(bankCertificate).subscribe()})
                   }                       
            else {

              const bankCertificate: BankCertificate = {
                bankCertificatesId: 0, // Or some default value if appropriate
                mortgageId: this.MortagegeId,
                ownerId: this.listIdOwnerOfmort[0],
                bankApproved: this.mortgageForm.get('toTheBank')?.value.bankId
              };


              this.srvMortagege.createBankCertificate(bankCertificate).subscribe( )

                          




            }
          },
          error => {
            console.error('Error creating bank certificate for ownerId:', error);
          }
) } });
}
        

  updateListBankCertificate(): void {
 
  
    console.log('Updated listBankCertificate:', this.listBankCertificate);

         this.srvMortagege.updateBankCertificates(this.listBankCertificate,this.MortagegeId,this.listIdOwnerOfmort).subscribe(
       response=>{

       }
     )

  }

}

