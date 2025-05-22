import { Component, inject, Input } from '@angular/core';
import { MortagegeService } from '../../service/mortagege.service';
import { Mortagege } from '../../Models/Mortagege.model';
import { CommonModule } from '@angular/common';
import { getMortgageStatusString } from '../../Models/MortgageStatus.enum';
import { BankService } from '../../service/bank.service';
import { CommentComponent } from '../comment/comment.component';
import { AdminApprovalComponent } from '../admin-approval/admin-approval.component';
import { MortagegeDTO } from '../../Models/MortagegeDTO.model';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-mortagege-view',
  imports: [
    CommonModule,CommentComponent,AdminApprovalComponent,DialogModule],
  templateUrl: './mortagege-view.component.html',
  styleUrl: './mortagege-view.component.css'
})
export class MortagegeViewComponent {
  mortgageIds: number[] = [];
  mortgageDetails: MortagegeDTO[]=[];
  @Input() tenantId: number = 9845;///יקבל מהאבאלשאול האם מקבל owner/teants
  @Input() ownerId: number[] = [9268];///יקבל מהאבאלשאול האם מקבל owner/teants
  @Input() apartmentId: number = 9986;///יקבל מהאבא
  srvMortagege: MortagegeService = inject(MortagegeService);
   srvBank: BankService = inject(BankService);
   selectedMortgage: MortagegeDTO | null = null; 
   commentText: string = "";
 ngOnInit(): void {
 this.loadMortgages(); 

  }
 loadMortgages( ): void {
  this.srvMortagege.getAllIdMortgageByTenant(this.tenantId).subscribe(response => {
   
 this.mortgageIds=response
 console.log(this.mortgageIds);
 
        this.loadMortgageDetails();
  })
}


loadMortgageDetails(): void {

this.mortgageDetails=[]
  this.mortgageIds.forEach(mortgageId => {
    this.srvMortagege.getMortgageById(mortgageId).subscribe(
      data => {
   
        this.mortgageDetails.push(data); // Store the details in an array
          });
          console.log( this.mortgageDetails);
          
})

}
   getStatusDescription(status: number): string {
     return getMortgageStatusString(status);
   }

   toggleMortgageDetails(mortgage: MortagegeDTO): void {
    console.log("toggleMortgageDetails");
    
    if (this.selectedMortgage === mortgage) {
      this.selectedMortgage = null; // Close if the same mortgage is clicked
      console.log("yes");
      
    } else {
      this.selectedMortgage = mortgage; // Show details for selected mortgage
    }}

    boolSend: boolean = false;
    visible: boolean = false;
    Send() {
    ///commentText צריך לעשות את תוכן 
       
   
      this.commentText += "בקשה לאישור יצירת משכנתא";
      this.visible = true;
      this.boolSend = true;
    }

    closeAdminApprovalDialog() {
      this.boolSend = false;
    }

    
   hasHistoryMortgages(): boolean {
    return this.mortgageDetails.some(mortgage => mortgage.mortagegeStatus === 3);
  }
}