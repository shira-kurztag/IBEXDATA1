import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // ייבוא עבור routerLink ו-router-outlet
import { CommonModule } from '@angular/common';
import { RightsConfirmationComponent } from '../rights-confirmation/rights-confirmation.component';
import { ApartmentDetailsByTenantComponent } from '../apartment-details-by-tenant/apartment-details-by-tenant.component';
import { ApartmentHomePageComponent } from '../apartment-home-page/apartment-home-page.component';
import { MainTenantComponent } from '../../tenant/maintenant/maintenant.component';

@Component({
  selector: 'app-details-apartment',
  standalone: true,
  imports: [RouterModule, CommonModule,
    RightsConfirmationComponent,
    ApartmentHomePageComponent,
    ApartmentDetailsByTenantComponent,
  MainTenantComponent], // ייבוא המודולים הנדרשים
  templateUrl: './details-apartment.component.html',
  styleUrls: ['./details-apartment.component.css']
})
export class DetailsApartmentComponent {
  activeComponent: string = ''; // מצב ברירת מחדל - לא מוצגת קומפוננטה

  setActiveComponent(componentName: string): void {
    this.activeComponent = componentName;
  }
}