import { Routes } from "@angular/router";
import { HomeComponent } from "./Component/home/home.component";
import { BankComponent } from "./Component/bank/bank.component";
import { ApartmentComponent } from "./Component/apartment/apartment.component";
import { ProjectComponent } from "./Component/project/project.component";
import { FareComponent } from "./Component/fare/fare.component";
import { ListContractorsComponent } from "./Component/contractor_/listcontractor/listcontractor.component";
import { MaincontractorComponent } from "./Component/contractor_/maincontractor/maincontractor.component";
import { AddContractorComponent } from "./Component/contractor_/addcontractor/addcontractor.component";
import { MortagegeComponent } from "./Component/mortagege/mortagege.component";
import { AddTenantComponent } from "./Component/tenant/addtenant/addtenant.component";
import { MainTenantComponent } from "./Component/tenant/maintenant/maintenant.component";
import { AddingApartmentComponent } from "./Component/adding-apartment/adding-apartment.component";
import { BuildingComponent } from "./Component/building/building.component";
 
 
export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'bank', component: BankComponent },
    { path: 'apartmentDetails', component: ApartmentComponent },
    { path: 'project/:id/:name/:flag', component: ProjectComponent },
    { path: 'fare', component: FareComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'addtenant', component: AddTenantComponent },
    { path: 'maintenant', component: MainTenantComponent },
    { path:'listcontractor', component:ListContractorsComponent},
    { path:'contractor/:id', component:MaincontractorComponent},
    { path:'AddContractors', component:AddContractorComponent},
    { path: 'mortagege', component: MortagegeComponent },
    { path: 'AddingApartmentComponent', component: AddingApartmentComponent },
    { path: 'buildings', component: BuildingComponent }, // נתיב לבניינים
]