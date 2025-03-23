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
    { path: 'mortagege', component: MortagegeComponent }
 
    // { path: 'contractor', component: ContractorComponent, children:[
    //    // {path:'', redirectTo: 'list', pathMatch:'full'},
    //     {path:'listcontractor', component:ListContractorsComponent},
    //     {path:'contractor/:id', component:MaincontractorComponent},
    //     {path:'AddContractors', component:AddContractorComponent},
    // ]},
    // { path: 'tenant', component: TenantComponent, children:[
    //     // {path:'', redirectTo: 'list', pathMatch:'full'},
    //     {path:'AddTenant', component:AddTenantComponent},
    //     {path:'mainTenant', component:MainTenantComponent},
    //  ]},
   
    // { path: 'list-contractors', component: ListContractorsComponent},
    // { path: '', component: ListContractorsComponent },
   // { path: 'contractor/:id', component: ContractorComponent },
  //  { path: 'ContractorList', component: ListContractorsComponent },
 //   { path: 'AddTenant', component: AddTenantComponent ,canDeactivate:[UnsavedChangesGuard]},
   // { path: 'tenant', component: TenantComponent },///+id
    //{ path: 'AddContractors', component: AddContractorComponent ,canDeactivate:[UnsavedChangesGuard]},
];