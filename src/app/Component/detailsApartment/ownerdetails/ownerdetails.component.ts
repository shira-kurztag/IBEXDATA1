import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OwnerService } from '../../../service/owner.service';

@Component({
  selector: 'app-owner-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule,NgIf],
  templateUrl: './ownerdetails.component.html',
  styleUrls: ['./ownerdetails.component.css'],
   providers: [OwnerService]
})
export class OwnerdetailsComponent {
  @Input() apartmentId!: number;

  editMode: boolean = false; // מצב עריכה - ברירת מחדל: תצוגה בלבד
  srvOwnerService: OwnerService = inject(OwnerService);

  ownerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {  
    this.ownerForm = this.createOwnerGroup({}); // אתחול טופס
  }
  
  ngOnInit(): void {
      console.log( this.apartmentId);
      // this.apartmentId = 9987; // מזהה דירה זמני
      console.log( this.apartmentId);
      this.GetOwner(this.apartmentId)
      
   }
  
   createOwnerGroup(owner: any): FormGroup {
    return this.fb.group({
      ownerId: [owner.ownerId ], // מספר
      purchasedFrom: [owner.purchasedFrom ], // מחרוזת
      purchaseDate: [owner.purchaseDate || null], // תאריך
      addressAccordingToContract: [owner.addressAccordingToContract ], // מחרוזת
      addressAndNumberOfMunicipal: [owner.addressAndNumberOfMunicipal ], // מחרוזת
      mailingAddress: [owner.mailingAddress ], // מחרוזת
      SecondAddress: [owner.secondAddress ], // מחרוזת
      descriptionPhone1: [owner.descriptionPhone1 ], // מחרוזת
      DescriptionPhone2: [owner.descriptionPhone2 ], // מחרוזת
      DescriptionPhone3: [owner.descriptionPhone3 ], // מחרוזת
      NumberStringPhone1: [owner.numberStringPhone1 ], // מחרוזת
      NumberStringPhone2: [owner.numberStringPhone2 ], // מחרוזת
      NumberStringPhone3: [owner.numberStringPhone3 ], // מחרוזת
      Fax: [owner.Fax ], // מספר
      Email: [owner.Email ], // מחרוזת
      LawyerName: [owner.LawyerName ], // מחרוזת
      DeadlineForReporting: [owner.DeadlineForReporting ], // תאריך
      IsReported: [owner.IsReported ], // בוליאני
      IsConfirmationReporting: [owner.IsConfirmationReporting ], // בוליאני
      ReporteFile: [owner.ReporteFile], // מחרוזת
      IsCorrectLackPurchaseTaxBalance: [owner.IsCorrectLackPurchaseTaxBalance ], // בוליאני
      IncumbentNumber: [owner.IncumbentNumber ], // מחרוזת
      HavePowerOfAttorney: [owner.HavePowerOfAttorney ], // בוליאני
      IsCorrectPowerOfAttorney: [owner.IsCorrectPowerOfAttorney ], // בוליאני
      PowerOfAttorneyFile: [owner.PowerOfAttorneyFile ], // מחרוזת
      IsGivenVouchers: [owner.IsGivenVouchers ], // בוליאני
      IsLegalExpensesPaid: [owner.IsLegalExpensesPaid ], // בוליאני
      PaidNote: [owner.PaidNote ], // מחרוזת
      IsSignedTofesHearot: [owner.IsSignedTofesHearot ], // בוליאני
      IsProducedHachira: [owner.IsProducedHachira ], // בוליאני
      IsFormSignedIrrevocableInstructions: [owner.IsFormSignedIrrevocableInstructions ], // בוליאני
      SignedIrrevocableInstructionsFile: [owner.SignedIrrevocableInstructionsFile ], // מחרוזת
      IsFurthermoreLackOfApproval: [owner.IsFurthermoreLackOfApproval ], // בוליאני
      LeaseNumberString: [owner.LeaseNumberString ], // מחרוזת
    });
  }


    GetOwner(apartmentID: number): void {
      this.srvOwnerService.GetOwnerByApartmentId(apartmentID).subscribe((owner: any) => {
        if (owner) {
          // אם מדובר באובייקט אחד, עדכן את הטופס עם patchValue
          this.ownerForm.patchValue(owner);
          console.log(owner);
        }
      });
    }
  
    saveOwnerChanges(): void {
      try {
        if (!this.ownerForm.valid) {
          console.log("הטופס לא תקין!");
          return;
        }
    
        this.editMode = false;
        this.updateProjectDates();
        console.log(this.ownerForm.value);
    
        this.srvOwnerService.UpdateOwner(this.ownerForm.value).subscribe({
          next: (owner: any) => {
            if (owner) {
              this.ownerForm.patchValue(owner);
              console.log("העדכון הצליח:", owner);
              this.GetOwner(this.apartmentId);
            }
          },
          error: (err) => {
            console.error("שגיאה במהלך שמירת השינויים:", err);
            this.GetOwner(this.apartmentId);
          }
        });
    
      } catch (error) {
        console.error("שגיאה כללית בפונקציה saveOwnerChanges:", error);
        this.GetOwner(this.apartmentId);
      }
    }
    
    cancelEdit(): void {
      this.editMode = false;
      this.ownerForm.reset(); // לאפס את הטופס או להחזיר ערכים ברירת מחדל
      this.GetOwner(this.apartmentId); // להטעין מחדש את הנתונים
    }
    toggleEdit(): void {
      this.editMode = true; // מעבר למצב עריכה
    }
    private updateProjectDates() {
      this.ownerForm.patchValue({
        dateWinningTender: this.formatDate(this.ownerForm.get('dateWinningTender')?.value),
        developmentPeriodEndDate: this.formatDate(this.ownerForm.get('developmentPeriodEndDate')?.value),
        collectionExpensesFrom1: this.formatDate(this.ownerForm.get('collectionExpensesFrom1')?.value),
        collectionExpensesFrom2: this.formatDate(this.ownerForm.get('collectionExpensesFrom2')?.value),
        collectionExpensesFrom3: this.formatDate(this.ownerForm.get('collectionExpensesFrom3')?.value),
        insertDate: this.formatDate(new Date()),
        updateDate: this.formatDate(new Date()),
        hachiraContractEndDate: this.formatDate(this.ownerForm.get('hachiraContractEndDate')?.value)
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
}
