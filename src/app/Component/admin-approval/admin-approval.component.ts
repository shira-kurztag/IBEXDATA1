import { Component, EventEmitter, inject, input, Input, Output } from '@angular/core';
import { MortagegeService } from '../../service/mortagege.service';
import { TypeMessage } from '../../Models/TypeMessage.model';
import { CommonModule } from '@angular/common';
import { AdminApprovalService } from '../../service/admin-approval.service';
import { User } from '../../Models/User.model';
import { __values } from 'tslib';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminApproval } from '../../Models/AdminApproval.model';

@Component({
  selector: 'app-admin-approval',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-approval.component.html',
  styleUrl: './admin-approval.component.css'
})
export class AdminApprovalComponent {
  constructor(private fb: FormBuilder) { }
  srvMortagege: MortagegeService = inject(MortagegeService);
  srvAdminApproval: AdminApprovalService = inject(AdminApprovalService);
  AllMortagegesTypes: TypeMessage[] = []
  AdminApprovalForm!: FormGroup;
  listAdmins: User[] = []
  @Input() apartmentId = 0
  @Input() comment = "";
  @Input() ownerId: number[] = [];

  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    this.initializeForm();

  
    this.srvMortagege.GetAllTypeMessages().subscribe(response => {


      this.AllMortagegesTypes = response ? (response as any)?.$values || response : []
    })

    this.srvAdminApproval.getAdmins().subscribe(response => {


      this.listAdmins = response ? (response as any).$values || response : []
    })
    console.log("ownerId" + this.ownerId);

  }

  initializeForm() {
    this.AdminApprovalForm = this.fb.group({
      message: [this.comment],
      messageType: [],//action
      ownerId: [this.ownerId],
      reciverId: this.fb.control([]),
      apartmentId: [this.apartmentId],
    });
  }


  onCloseClick() {
    this.close.emit();
  }

  onSubmit() {
    debugger

    console.log("on submit" + this.ownerId);
    if (this.ownerId && this.ownerId.length > 0) {
      this.AdminApprovalForm.patchValue({
        ownerId: this.ownerId,
      });
    }
    if (this.AdminApprovalForm.get('reciverId')?.value === "0") {
      // "כל המנהלים" selected, add all manager IDs to the array
      const allManagerIds = this.listAdmins.map((admin) => admin.userId);

      this.AdminApprovalForm.patchValue({
        reciverId: allManagerIds,
      });

    }
    else {
      // Specific manager selected, add only that manager's ID
      this.AdminApprovalForm.get('reciverId')?.setValue([this.AdminApprovalForm.get('reciverId')?.value]);
    }

    const ownerIds = this.AdminApprovalForm.value.ownerId || [];
    ownerIds.forEach((ownerId: number) => {
      const formData: AdminApproval = {
        ...this.AdminApprovalForm.value, // כל שאר הערכים מהפורם
        ownerId: ownerId, // עדכון ownerId לערך הנוכחי
      };


      this.srvAdminApproval.addAdminApproval(formData).subscribe({
        next: () => {
          alert('הנתונים נשמרו בהצלחה!');
          this.AdminApprovalForm.reset();
          this.close.emit();
        },
        error: (err) => {
          console.error(err);
          alert('אירעה שגיאה בעת שמירת הנתונים.');
        },
      });
    })
  }
}
