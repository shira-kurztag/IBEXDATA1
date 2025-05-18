import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // ייבוא עבור routerLink ו-router-outlet
import { CommonModule } from '@angular/common';
import { ApartmentDetailsByTenantComponent } from '../apartment-details-by-tenant/apartment-details-by-tenant.component';
import { ApartmentHomePageComponent } from '../apartment-home-page/apartment-home-page.component';
import { MainTenantComponent } from '../../tenant/maintenant/maintenant.component';
import { RightsApprovalComponent } from '../rights-approval/rights-approval.component';

@Component({
  selector: 'app-details-apartment',
  standalone: true,
  imports: [RouterModule, CommonModule,
    RightsApprovalComponent,
    ApartmentHomePageComponent,
    ApartmentDetailsByTenantComponent,
  MainTenantComponent], // ייבוא המודולים הנדרשים
  templateUrl: './details-apartment.component.html',
  styleUrls: ['./details-apartment.component.css']
})
export class DetailsApartmentComponent {
  activeComponent: string = ''; // מצב ברירת מחדל - לא מוצגת קומפוננטה
  apartmentId: number = 9987;  // <-- שונה מ-apartmentID ל-apartmentId

  setActiveComponent(componentName: string): void {
    this.activeComponent = componentName;
  }
}