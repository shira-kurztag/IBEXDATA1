import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-approval-view',
  imports: [],
  templateUrl: './admin-approval-view.component.html',
  styleUrl: './admin-approval-view.component.css'
})
export class AdminApprovalViewComponent {
  
  @Input() mortagegeId: number = 9087;///יקבל מהאבא
  updateRequest(request: any): void {
    // // כאן ניתן להוסיף לוגיקה לעדכון הסטטוס של הבקשה
    // console.log('עדכון בקשה:', request);
    // request.status = 'מאושר'; // דוגמה: עדכון הסטטוס ל"מאושר"
    // request.updateDate = new Date(); // עדכון תאריך
  }

  ngOnInit() {

    
}
}