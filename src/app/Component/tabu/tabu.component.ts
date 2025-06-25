import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TabuDTO } from '../../Models/TabuDTO.model';
import { TabuService } from '../../service/tabu.service';

@Component({
  selector: 'app-tabu',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgIf],
  standalone: true,
  templateUrl: './tabu.component.html',
  styleUrl: './tabu.component.css',
  providers: [TabuService],
})
export class TabuComponent {
  tabuForm: FormGroup
  @Input() apartmentId!: number;
  editMode: boolean = false;
  srvOwnerService: TabuService = inject(TabuService);
  isMortgagePaid: boolean = false;
  isPurchaseTax: boolean = false;
  isCapitalTax: boolean = false;
  isApprovalNeededSaleTaxHas: boolean = false;
  isMunicipalityApproval: boolean = false;
  isTaxApprovedTransferRightsSource: boolean = false;
  isPartiesSigned: boolean = false;
  isSignedByMm: boolean = false;
  isMortgageBillReceived: boolean = false;
  isTaxApprovedTransferRightsValid: boolean = false;
  isMunicipalityApprovalValidity: boolean = false;
  isApprovalNeededSaleTaxValid: boolean = false;
  isCapitalTaxValid: boolean = false;
  isPurchaseTaxValid: boolean = false;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private srvTabu: TabuService

  ) {
    this.tabuForm = this.fb.group({

    });
  }
  ngOnInit(): void {
    this.updateLabels()
    console.log(this.apartmentId);
    this.getTabu();
     this.tabuForm.valueChanges.subscribe(() => {
      this.updateLabels();
      console.log(this.isPurchaseTax);
      
    });
  }
getEmptyTabu(): TabuDTO {
  return {
    tabuId: 0,
    apartmentId: 0,
    ownerId: 0,
    isMortgagePaid: false,
    commonArea: 0,
    notarizedPoweReason: '',
    isPurchaseTax: false,
    isPurchaseTaxValid: false,
    isCapitalTax: false,
    isCapitalTaxValid: false,
    isApprovalNeededSaleTaxHas: false,
    isApprovalNeededSaleTaxValid: false,
    isMunicipalityApproval: false,
    isTaxApprovedTransferRights: false,
    isTaxApprovedTransferRightsSource: false,
    isTaxApprovedTransferRightsValid: false,
    isPartiesSigned: false,
    isSignedByMm: false,
    isMortgageBillReceived: false,
    fareName: '',
    fareAmount: 0,
    bloc: 0,
    smooth: 0,
    smothArea: 0,
  };
}

  createTabuForm(tabu: TabuDTO): FormGroup {
    return this.fb.group({
      // טאבּוּ
      tabuId: [tabu.tabuId || 0],
      ApartmentId: [tabu.apartmentId],
      ownerId: [tabu.ownerId || 0],
      isMortgagePaid: [tabu.isMortgagePaid || false],
      commonArea: [tabu.commonArea || 0],
      notarizedPoweReason: [tabu.notarizedPoweReason || ''],
      isPurchaseTax: [tabu.isPurchaseTax || false],
      isPurchaseTaxValid: [tabu.isPurchaseTaxValid || false],
      isCapitalTax: [tabu.isCapitalTax || false],
      isCapitalTaxValid: [tabu.isCapitalTaxValid || false],
      isApprovalNeededSaleTaxHas: [tabu.isApprovalNeededSaleTaxHas || false],
      isApprovalNeededSaleTaxValid: [tabu.isApprovalNeededSaleTaxValid || false],
      isMunicipalityApproval: [tabu.isMunicipalityApproval || false],
      isMunicipalityApprovalValidity: [tabu.isMunicipalityApprovalValidity || null],
      isTaxApprovedTransferRights: [tabu.isTaxApprovedTransferRights || false],
      isTaxApprovedTransferRightsSource: [tabu.isTaxApprovedTransferRightsSource || false],
      isTaxApprovedTransferRightsValid: [tabu.isTaxApprovedTransferRightsValid || false],
      isPartiesSigned: [tabu.isPartiesSigned || false],
      isSignedByMm: [tabu.isSignedByMm || false],
      isMortgageBillReceived: [tabu.isMortgageBillReceived || false],
      fareName: [tabu.fareName || ''],
      fareAmount: [tabu.fareAmount || 0],
      bloc: [tabu.bloc || 0],
      smooth: [tabu.smooth || 0],
      smothArea: [tabu.smothArea || 0],

    });
  }

  // getTabu(): void {
  //   this.srvTabu.GetTabuByApartmentId(this.apartmentId).subscribe((tabu: TabuDTO) => {
  //     if (tabu) {
  //       const formGroup = this.createTabuForm(tabu);
  //       this.tabuForm = formGroup;
  //     }
  //   });
  // }
  getTabu(): void {
  this.srvTabu.GetTabuByApartmentId(this.apartmentId).subscribe((tabu: TabuDTO) => {
    if (tabu) {
      this.tabuForm = this.createTabuForm(tabu);
    } else {
      this.tabuForm = this.createTabuForm(this.getEmptyTabu());
    }
  });
}

  private updateProjectDates() {
    this.tabuForm.patchValue({
      dateWinningTender: this.formatDate(this.tabuForm.get('dateWinningTender')?.value),
      developmentPeriodEndDate: this.formatDate(this.tabuForm.get('developmentPeriodEndDate')?.value),
      collectionExpensesFrom1: this.formatDate(this.tabuForm.get('collectionExpensesFrom1')?.value),
      collectionExpensesFrom2: this.formatDate(this.tabuForm.get('collectionExpensesFrom2')?.value),
      collectionExpensesFrom3: this.formatDate(this.tabuForm.get('collectionExpensesFrom3')?.value),
      insertDate: this.formatDate(new Date()),
      updateDate: this.formatDate(new Date()),
      hachiraContractEndDate: this.formatDate(this.tabuForm.get('hachiraContractEndDate')?.value)
    });
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
  updateLabels(): void {
    const form = this.tabuForm.value;
    this.isMortgagePaid = form.isMortgagePaid;
    this.isPurchaseTax = form.isPurchaseTax;
    this.isPurchaseTaxValid = form.isPurchaseTaxValid;
    this.isCapitalTax = form.isCapitalTax;
    this.isCapitalTaxValid = form.isCapitalTaxValid;
    this.isApprovalNeededSaleTaxHas = form.isApprovalNeededSaleTaxHas;
    this.isApprovalNeededSaleTaxValid = form.isApprovalNeededSaleTaxValid;
    this.isMunicipalityApproval = form.isMunicipalityApproval;
    this.isMunicipalityApprovalValidity = form.isMunicipalityApprovalValidity;
    this.isTaxApprovedTransferRightsSource = form.isTaxApprovedTransferRightsSource;
    this.isTaxApprovedTransferRightsValid = form.isTaxApprovedTransferRightsValid;
    this.isPartiesSigned = form.isPartiesSigned;
    this.isSignedByMm = form.isSignedByMm;
    this.isMortgageBillReceived = form.isMortgageBillReceived;

  }

  saveTabuChanges() {
    try {
      this.updateProjectDates()
      this.editMode = false;
      console.log(this.tabuForm.value);
      this.srvTabu.UpdateTabu(this.tabuForm.value).subscribe({
        next: (tabu: any) => {
          if (tabu) {
            this.tabuForm.patchValue(tabu);
            console.log("העדכון הצליח:", tabu);
            this.getTabu();
          }
        },
        error: (err: any) => {
          console.error("שגיאה במהלך שמירת השינויים:", err);
          this.getTabu();
        }
      });

    } catch (error) {
      console.error("שגיאה כללית בפונקציה saveOwnerChanges:", error);
      this.getTabu();
    }
  }



  toggleEdit() {
    this.editMode = true; // מעבר למצב עריכה

  }

  cancelEdit(): void {
    this.editMode = false;
  }

}
