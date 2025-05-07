import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OwnerService } from '../../../service/owner.service';

@Component({
  selector: 'app-owner-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule,NgIf,OwnerService],
  templateUrl: './ownerdetails.component.html',
  styleUrls: ['./ownerdetails.component.css']
})
export class OwnerdetailsComponent {
  @Input() apartmentID!: number;

  editMode: boolean = false; // מצב עריכה - ברירת מחדל: תצוגה בלבד

  ownerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {  
    this.ownerForm = this.createOwnerGroup({}); // אתחול טופס
  }
  
  ngOnInit(): void {
      this.apartmentID = 10032; // מזהה דירה זמני
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
    loadOwnerData(apartmentID: number): void {
      // כאן אפשר להוסיף את הקוד להטעין נתונים משרת
      //  this.OwnerService.GetOwnerByApartmentId(apartmentID).subscribe(owner => {
      //     this.ownerForm.patchValue(owner);
      // });
    }

    saveOwnerChanges(): void {
      if (this.ownerForm.valid) {
        // כאן אפשר להוסיף את הקוד לשמור את השינויים בשרת
        console.log(this.ownerForm.value);
      } else {
        console.log("הטופס לא תקין!");
      }
    }

    cancelEdit(): void {
      this.editMode = false;
      this.ownerForm.reset(); // לאפס את הטופס או להחזיר ערכים ברירת מחדל
      this.loadOwnerData(this.apartmentID); // להטעין מחדש את הנתונים
    }
    toggleEdit(): void {
      this.editMode = true; // מעבר למצב עריכה
    }
  
}
