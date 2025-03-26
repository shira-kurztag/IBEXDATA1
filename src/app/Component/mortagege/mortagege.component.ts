import { Mortagege } from '../../Models/Mortagege.model';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { PanelModule } from 'primeng/panel';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MortagegeService } from '../../service/mortagege.service';
import { MortagegesTypes } from '../../Models/MortagegesTypes.model';
import { MortagegeLevels } from '../../Models/MortagegeLevels.model';
import { CurrencyType } from '../../Models/CurrencyType.model';

@Component({
  selector: 'app-mortagege',
  imports: [CommonModule, FormsModule, SelectModule,HttpClientModule,ToggleSwitchModule],
  templateUrl: './mortagege.component.html',
  styleUrl: './mortagege.component.css',
  providers: [MortagegeService] 
})
export class MortagegeComponent {
  selectedMortagegesType: MortagegesTypes | null = null;
  mortagegesTypes: MortagegesTypes[] = [];
  bankName?: number; // הגדרת bankName כ-number
  ////
  borrowerOptions: { label: string, value: string }[] = [
    { label: ' כל בעלי זכויות', value: 'all' },
    { label: '??', value: 'unknown' }
  ];

  unlimitedAmountOptions:{ label: string, value: string }[] = [
    { label: '  סכום  ', value: 'Amount' },
    { label: 'ללא הגבלת סכום', value: 'NoAmountLimit' }];

    listMortagegeLevels:MortagegeLevels[]=[]
    selectedRank: number | null = null;

onSelectRank(event: any): void {
  this.selectedRank = event.value;
}
  selectedunlimitedAmount: { label: string, value: string } | null = this.unlimitedAmountOptions[0];
  rightsApproval: boolean = false; // משתנה לבחירה לאישור זכויות
  selectedBorrower: string = '';
  borrowerName: string = '';
  commitmentAmount: number | null = null;
  selectedCurrencyType: CurrencyType | null = null; // הוספתי משתנה זה
  listCurrencyType:CurrencyType[]=[]
  unlimitedAmount: boolean = false;
  NoteOrConditioning: string = '';//db-NoteOrConditioning
  irrevocableInstructions: boolean = false;
  companyApproval: boolean = false;///db-IsApprovalCompany
  additionalNote: string = '';
  showErrors: boolean = false;
  savedMortagege: Mortagege | null = null; // שדה חדש לפרטי המשכנתא שנשמרו
  srvMortagege: MortagegeService = inject(MortagegeService);
  router: Router = inject(Router);
 onSelectCurrencyType(event: any): void {
      this.selectedCurrencyType = event.value;
    }
    onSelectUnlimitedAmount(event: any): void {
      this.selectedunlimitedAmount = event.value;
    }
  ngOnInit(): void {
    this.srvMortagege.GetAllMortagegesTypes().subscribe(mortagegesTypes => {
      this.mortagegesTypes = mortagegesTypes;
      this.selectedMortagegesType=this.mortagegesTypes[0]
      });
    
    this.srvMortagege.GetAllCurrencyTypes().subscribe(currencyTypes=>{
    this.listCurrencyType=currencyTypes
   // הגדרת הערך הנבחר הראשון ברשימה
   if (this.listCurrencyType.length > 0) {
    this.selectedCurrencyType = this.listCurrencyType[0];
  }
    })
    this.srvMortagege.GetAllMortagegeLevels().subscribe(MortagegeLevels=>{
this.listMortagegeLevels=MortagegeLevels
    })
  }

  onSelectMortagegesType(event: any): void {
    this.selectedMortagegesType = event.value;
  }

  cancel() {
    // this.router.navigate(['/parent-page']);
    //יש לעבור לקומפוננטת האב
  }

  save() {
    if (this.selectedMortagegesType && this.bankName !== undefined) {
      const newMortagege: Mortagege = {
        mortagegesTypes: this.selectedMortagegesType.mortagegesTypeId,
        toTheBank: this.bankName,
        mortagegeStatus: 1
      };
        this.savedMortagege = newMortagege; // נוודא שהאובייקט מאותחל לפני השימוש בו
        this.showErrors = false;
      }
    else {
      this.showErrors = true;
    }
  }
  saveAll(){

  }
}
