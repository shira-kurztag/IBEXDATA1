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
  @Input() apartmentID!: number;

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
      this.apartmentID = 10032; // מזהה דירה זמני
      this.GetOwner(this.apartmentID)
   }
  
    createOwnerGroup(owner: any): FormGroup {
      return this.fb.group({
        OwnerId: [owner.OwnerId || 0], // מספר
        OwnerStatus: [owner.OwnerStatus || 0], // מספר
        ApartmentId: [owner.ApartmentId || 0], // מספר
        OwnerApartmentStatus: [owner.OwnerApartmentStatus || 0], // מספר
        MailingAddress: [owner.MailingAddress || ''], // מחרוזת
        DescriptionPhone1: [owner.DescriptionPhone1 || ''], // מחרוזת
        DescriptionPhone2: [owner.DescriptionPhone2 || ''], // מחרוזת
        DescriptionPhone3: [owner.DescriptionPhone3 || ''], // מחרוזת
        NumberPhone1: [owner.NumberPhone1 ], // מספר
        NumberPhone2: [owner.NumberPhone2 ], // מספר
        NumberPhone3: [owner.NumberPhone3 ], // מספר
        Fax: [owner.Fax ], // מספר
        Email: [owner.Email || ''], // מחרוזת
        LawyerName: [owner.LawyerName || ''], // מחרוזת
        DeadlineForReporting: [owner.DeadlineForReporting || null], // תאריך
        IsReported: [owner.IsReported || false], // בוליאני
        HavePowerOfAttorney: [owner.HavePowerOfAttorney || false], // בוליאני
        IsGivenVouchers: [owner.IsGivenVouchers || false], // בוליאני
        IsLegalExpensesPaid: [owner.IsLegalExpensesPaid || false], // בוליאני
        IsFormSignedIrrevocableInstructions: [owner.IsFormSignedIrrevocableInstructions || false], // בוליאני
        PurchasDate: [owner.PurchasDate || null], // תאריך
        AddressByContract: [owner.AddressByContract || ''], // מחרוזת
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
              this.GetOwner(this.apartmentID);
            }
          },
          error: (err) => {
            console.error("שגיאה במהלך שמירת השינויים:", err);
            this.GetOwner(this.apartmentID);
          }
        });
    
      } catch (error) {
        console.error("שגיאה כללית בפונקציה saveOwnerChanges:", error);
        this.GetOwner(this.apartmentID);
      }
    }
    
    cancelEdit(): void {
      this.editMode = false;
      this.ownerForm.reset(); // לאפס את הטופס או להחזיר ערכים ברירת מחדל
      this.GetOwner(this.apartmentID); // להטעין מחדש את הנתונים
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
