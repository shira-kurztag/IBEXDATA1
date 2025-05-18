import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { HttpClientModule } from '@angular/common/http';
import { ContractorService } from '../../../service/contractor.service';

@Component({
  selector: 'app-addcontractor',
  imports: [
    CommonModule,ReactiveFormsModule,NgIf, RouterModule,InputTextModule,ButtonModule,CardModule,HttpClientModule],
  templateUrl: './addcontractor.component.html',
  styleUrl: './addcontractor.component.css',
  providers: [ContractorService]
})

export class AddContractorComponent {
  contractorForm: FormGroup;
  srvContractor: ContractorService = inject(ContractorService);

  errorMessage: string | null = null;
  isSaved: boolean = false;
  isCanceling: boolean = false;


  constructor(private fb: FormBuilder, private router: Router) {
    this.contractorForm = this.fb.group({
      contractorId: [0],
      contractorIdentity: ['', [Validators.pattern('^[0-9]+$')]], // הוספתי ערך ברירת מחדל ריק
      contractorName: ['', [Validators.pattern('^[a-zA-Zא-ת .()"-]+$')]], // הוספתי ערך ברירת מחדל ריק וסוגריים מרובעים
      managementName: ['', [Validators.pattern('^[a-zA-Zא-ת .()"-]+$')]], // הוספתי ערך ברירת מחדל ריק וסוגריים מרובעים
      managementId: [null, [this.validateId.bind(this)]], // אין שינוי
      address: [''], // אין שינוי
      certificateConsortium: ['', [Validators.pattern('^[a-zA-Z0-9א-ת .-]+$')]], // הוספתי ערך ברירת מחדל ריק וסוגריים מרובעים
      form50: ['', [Validators.pattern('^[a-zA-Z0-9א-ת .-]+$')]], // הוספתי ערך ברירת מחדל ריק וסוגריים מרובעים
    });
  }


  onSubmit() {
    if (this.contractorForm.valid) {
      this.srvContractor.addContractor(this.contractorForm.value).subscribe({
        next: () => {
          this.isSaved = true;
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error adding contractor:', error);
          this.errorMessage = 'Failed to add contractor. Please try again later.';
        }
      });
    }
  }

  cancel() {
    this.isCanceling = true;
    if (this.contractorForm.dirty && !this.isSaved) {
      const confirmCancel = confirm('האם אתה בטוח שברצונך לצאת מבלי לשמור את הנתונים?');
      if (confirmCancel) {
        this.router.navigate(['/']);
      } else {
        this.isCanceling = false;
      }
    } else {
      this.router.navigate(['/']);
    }
  }
  ///בדיקת ת.ז
  validateId(control: AbstractControl): ValidationErrors | null {
    const isValid = this.srvContractor.isIsraeliIdNumber(control.value);
    return isValid ? null : { invalidId: true };
  }
  
}  
