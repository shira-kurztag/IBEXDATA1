import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
  imports: [CommonModule,FormsModule,ReactiveFormsModule ],
  templateUrl: './admin-approval.component.html',
  styleUrl: './admin-approval.component.css'
})
export class AdminApprovalComponent {
  constructor( private fb: FormBuilder) { }
  srvMortagege: MortagegeService = inject(MortagegeService);
  srvAdminApproval: AdminApprovalService = inject(AdminApprovalService);
  AllMortagegesTypes:TypeMessage[]=[]
  AdminApprovalForm!: FormGroup;
  listAdmins:User[]=[]
  @Input() apartmentId=0
@Input() comment="";
@Input() ownerId: number[] = [];
@Output() close = new EventEmitter<void>();
ngOnInit(): void {
this.initializeForm();
  this.srvMortagege.GetAllTypeMessages().subscribe(response => {
    console.log(response);
    
    console.log(this.AllMortagegesTypes);
    
   this.AllMortagegesTypes=response? (response as any)?.$values||response:[]
  })

  this.srvAdminApproval.getAdmins().subscribe(response => {
    console.log(response?(response as any).$values||response:[]);
    
 this.listAdmins=response?(response as any).$values||response:[]
  })
}

initializeForm() {
  this.AdminApprovalForm = this.fb.group({
    message:[this.comment],
    messageType:[],//action
    // OwnerId:number,
    reciverId: this.fb.control([])  ,  
    apartmentId:[this.apartmentId],
  });
}


  onCloseClick() {
    this.close.emit();
  }

  onSubmit() {
   
    if (this.AdminApprovalForm.valid) {
     
 
     


           if (this.AdminApprovalForm.get('reciverId')?.value === "0") {
    // "כל המנהלים" selected, add all manager IDs to the array
    const allManagerIds = this.listAdmins.map((admin) => admin.userId);
    console.log('All Manager IDs:', allManagerIds);
    this.AdminApprovalForm.patchValue({
      reciverId: allManagerIds,
    });
    
  } 
  else {
    // Specific manager selected, add only that manager's ID
    this.AdminApprovalForm.get('reciverId')?.setValue([this.AdminApprovalForm.get('reciverId')?.value]);
  }

  const formData: AdminApproval = this.AdminApprovalForm.value;
  console.log('Final Form Data:', formData);
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
    } else {
      alert('אנא מלא את כל השדות החסרים.');
    }
  }
}
