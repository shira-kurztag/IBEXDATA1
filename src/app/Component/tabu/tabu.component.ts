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
    console.log(this.apartmentId);
    this.getTabu();
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

  getTabu(): void {
    this.srvTabu.GetTabuByApartmentId(this.apartmentId).subscribe((tabu: TabuDTO) => {
      if (tabu) {
        const formGroup = this.createTabuForm(tabu);
        this.tabuForm = formGroup;
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
