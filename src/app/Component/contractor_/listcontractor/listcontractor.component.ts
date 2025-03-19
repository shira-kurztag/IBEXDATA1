import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete'
import { ButtonModule } from 'primeng/button';
import { ContractorService } from '../../../service/contractor.service';
import { Contractor } from '../../../Models/Contractor.model';

@Component({
  selector: 'app-listcontractor',
  imports: [CommonModule, FormsModule, SelectModule, CardModule, PanelModule, HttpClientModule,InputTextModule,AutoComplete,ButtonModule],
  templateUrl: './listcontractor.component.html',
  styleUrl: './listcontractor.component.css',
  providers: [ContractorService] 
})
export class ListContractorsComponent implements OnInit {
  value: string | undefined;
  contractors: Contractor[] = [];
  selectedContractor: Contractor | null = null;
  filteredContractor: Contractor[] = []; // Type change to Contractors[]
  constructor(private contractorService: ContractorService, private router: Router) {}


filterContractor(event: AutoCompleteCompleteEvent) {
  const query = event.query.toLowerCase();
  this.filteredContractor = this.contractors.filter(contractor =>

    contractor.contractorName?.toLowerCase().includes(query)
  );
  console.log(this.filteredContractor[0].contractorName);
  console.log(this.filteredContractor[1].contractorName);
  console.log(this.filteredContractor[2].contractorName);
  console.log(this.filteredContractor[3].contractorName);
}

  ngOnInit(): void {
    this.contractorService.getContractors().subscribe(contractors => {
      this.contractors = contractors;
      console.log("vcvc",this.contractors);
    });
    
    
  }

  onSelectContractor(event: any): void {
    this.selectedContractor = event.value;
    if (this.selectedContractor) {
      this.router.navigate(['/contractor', this.selectedContractor.contractorId]);
    }
  }
  toggleAddContractorComponent() {
  

    this.router.navigate(['/AddContractors'])

  }

}