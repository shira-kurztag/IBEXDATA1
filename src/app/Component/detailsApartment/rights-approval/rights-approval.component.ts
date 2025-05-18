import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FareService } from '../../../service/fare.service';

@Component({
  selector: 'app-rights-approval',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './rights-approval.component.html',
  styleUrl: './rights-approval.component.css'
})
export class RightsApprovalComponent implements OnInit {
  @Input() apartmentId!: number;

  RightsApprovalForm: FormGroup;

  // משתנים להצגת "כן / לא"
  forwardedCopyOfID = false;
  AllowedToReceiveRightsApproval = false;
  isPaid = false;
  ReviewedPayment = false;
  amount:number=0;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private fareService: FareService // הוספה כאן

  ) {
    this.RightsApprovalForm = this.createRightsApprovalForm({});
  }

  ngOnInit(): void {
    this.updateLabels(); // עדכון ראשוני
   this.filterFare("תשלום לאישור זכויות")
    this.RightsApprovalForm.valueChanges.subscribe(() => {
      this.updateLabels();
    });
  }

  createRightsApprovalForm(RightsApproval: any): FormGroup {
    return this.fb.group({
      insertDate: [RightsApproval.insertDate || null],
      forwardedCopyOfID: [RightsApproval.forwardedCopyOfID || false],
      AllowedToReceiveRightsApproval: [RightsApproval.AllowedToReceiveRightsApproval || false],
      isPaid: [RightsApproval.isPaid || false],
      Paid: [this.amount || 0],
      ReviewedPaymentOfCommonHouseRegistration: [RightsApproval.ReviewedPaymentOfCommonHouseRegistration || false],
    });
  }

  updateLabels(): void {
    const form = this.RightsApprovalForm.value;
    this.forwardedCopyOfID = form.forwardedCopyOfID;
    this.AllowedToReceiveRightsApproval = form.AllowedToReceiveRightsApproval;
    this.isPaid = form.isPaid;
    this.ReviewedPayment = form.ReviewedPaymentOfCommonHouseRegistration;
  }
 filterFare(fareName: string) {
  this.fareService.filterFare(fareName).subscribe(
    
    fares => {
      debugger;
      if (fares.length > 0) {
       this. amount = fares[0].fareAmount; // או השדה הרלוונטי
        this.RightsApprovalForm.patchValue({ Paid: this.amount });
        console.log('תעריף עודכן:', this.amount);
      } else {
        console.warn('לא נמצא תעריף מתאים');
      }
    },
    error => {
      console.error('שגיאה בשליפת תעריף:', error);
    }
  );
}

  ProductionRightsApproval() {
    // פונקציה שתקרא בעת לחיצה על כפתור "הפקת אישור זכויות"
    console.log('נתוני הטופס:', this.RightsApprovalForm.value);
  }
}
