import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-owner-details',
  standalone: true,
  imports: [],
  templateUrl: './ownerdetails.component.html',
  styleUrls: ['./ownerdetails.component.css']
})
export class OwnerdetailsComponent {
  editMode: boolean = false; // מצב עריכה - ברירת מחדל: תצוגה בלבד

  @Input() apartmentID!: number;
  
  toggleEdit(): void {
    this.editMode = true; // מעבר למצב עריכה
  }
}
