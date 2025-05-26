import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OwnerdetailsComponent } from '../detailsApartment/ownerdetails/ownerdetails.component';
import { TabuDTO } from '../../Models/TabuDTO.model';
import { TabuService } from '../../service/tabu.service';

@Component({
  selector: 'app-tabu',
  imports: [CommonModule, ReactiveFormsModule,RouterModule ],
  standalone:true,
  templateUrl: './tabu.component.html',
  styleUrl: './tabu.component.css',
  providers: [TabuService],
})
export class TabuComponent {
    tabuForm: FormGroup | undefined; // טופס ריאקטיבי
    @Input() apartmentId!: number;
    isEditMode:boolean = false;
    
 constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private srvTabu:TabuService
    
  ) {
    this.tabuForm = this.fb.group({
      tenants: this.fb.array([]),
    });
  }
 ngOnInit(): void {
    console.log(this.apartmentId);
    this.getTabu();
  }

 createTabuForm(tabu: TabuDTO): FormGroup {
  return this.fb.group({
    // טאבּוּ
    tabuId: [tabu.tabuId || 0],
    ApartmentId: [tabu.apartmentId],
    ownerId: [tabu.ownerId || 0],
    isMortgagePaid: [tabu.isMortgagePaid || false],
    commonArea: [tabu.commonArea || 0],
    notarizedPoweReason: [tabu.notarizedPoweReason || ''],
    isPurchaseTax: [tabu.isPurchaseTax || false],
    isPurchaseTaxValid: [tabu.isPurchaseTaxValid || false],
    isCapitalTax: [tabu.isCapitalTax || false],
    isCapitalTaxValid: [tabu.isCapitalTaxValid || false],
    isApprovalNeededSaleTaxHas: [tabu.isApprovalNeededSaleTaxHas || false],
    isApprovalNeededSaleTaxValid: [tabu.isApprovalNeededSaleTaxValid || false],
    isMunicipalityApproval: [tabu.isMunicipalityApproval || false],
    isMunicipalityApprovalValidity: [tabu.isMunicipalityApprovalValidity || null],
    isTaxApprovedTransferRights: [tabu.isTaxApprovedTransferRights || false],
    isTaxApprovedTransferRightsSource: [tabu.isTaxApprovedTransferRightsSource || false],
    isTaxApprovedTransferRightsValid: [tabu.isTaxApprovedTransferRightsValid || false],
    isPartiesSigned: [tabu.isPartiesSigned || false],
    isSignedByMm: [tabu.isSignedByMm || false],
    isMortgageBillReceived: [tabu.isMortgageBillReceived || false],
    fareName: [tabu.fareName || ''],
    fareAmount: [tabu.fareAmount || 0],
    bloc: [tabu.bloc || 0],
    smooth: [tabu.smooth || 0],
    smothArea: [tabu.smothArea || 0],

    });
  }

getTabu(): void {
  this.srvTabu.GetTabuByApartmentId(this.apartmentId).subscribe((tabu: TabuDTO) => {
    if (tabu) {
      const formGroup = this.createTabuForm(tabu);
      this.tabuForm = formGroup;
    }
  });
}


  


}
