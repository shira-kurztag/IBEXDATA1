import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rights-approval',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './rights-approval.component.html',
  styleUrl: './rights-approval.component.css'
})
export class RightsApprovalComponent implements OnInit {

  RightsApprovalForm: FormGroup;

  // משתנים להצגת "כן / לא"
  forwardedCopyOfID = false;
  AllowedToReceiveRightsApproval = false;
  isPaid = false;
  ReviewedPayment = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.RightsApprovalForm = this.createRightsApprovalForm({});
  }

  ngOnInit(): void {
    this.updateLabels(); // עדכון ראשוני

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
      Paid: [RightsApproval.Paid || 0],
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

  ProductionRightsApproval() {
    // פונקציה שתקרא בעת לחיצה על כפתור "הפקת אישור זכויות"
    console.log('נתוני הטופס:', this.RightsApprovalForm.value);
  }
}
