import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-approval',
  imports: [],
  templateUrl: './admin-approval.component.html',
  styleUrl: './admin-approval.component.css'
})
export class AdminApprovalComponent {
@Input() comment="";
}
