import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Fare } from '../../Models/Fare.model';
import { FareService } from '../../service/fare.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { PickListModule } from 'primeng/picklist';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PanelModule } from 'primeng/panel';


@Component({
  standalone: true,
  selector: 'app-fare',
  imports: [PanelModule, PickListModule, HttpClientModule, FormsModule, ListboxModule, CommonModule, BreadcrumbModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './fare.component.html',
  styleUrl: './fare.component.css'
})
export class FareComponent implements OnInit {
  sourceFare!: Fare[];
  targetFare!: Fare[];
  Fares$!: Fare[];
  fare: Fare = new Fare();
  newFare: Fare = new Fare();
  fareDialog!: boolean;
  editMode: boolean = false;
  addMode: boolean = false; // הוספת המגדיר addMode
  carService: FareService = inject(FareService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  messageService: MessageService = inject(MessageService);
  searchText: string = '';
  filteredFares!: Fare[];
  formSubmitted: boolean = false;

  breadcrumbItems!: MenuItem[];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadFare();

    this.breadcrumbItems = [
      { label: 'דף הבית', url: '/' },
      { label: 'רשימת תעריפים', url: '/fares' }
    ];
  }

  loadFare() {
    this.carService.getFares().subscribe((fares) => {
      this.Fares$ = fares;
      this.filteredFares = fares;
      console.log(fares);
    });
  }

  toggleEditMode() {
    if (this.editMode) {
      this.saveAllFares();
    }
    this.editMode = !this.editMode;
    this.addMode = false; // Reset addMode when toggling editMode
  }

  toggleAddMode() {
    this.addMode = !this.addMode;
  }

  saveAllFares() {
    this.formSubmitted = true;
    this.filteredFares.forEach(fare => {
      if (fare.fareName && fare.fareAmount !== undefined) {
        this.carService.updateFareAmount(fare.fareId, fare.fareAmount).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Fare Amount Updated', life: 3000 });
            this.loadFare();
          },
          (error) => {
            console.error('Error updating fare amount:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update fare amount', life: 3000 });
          }
        );
      } else {
        console.error('Fare name or amount is missing for fare:', fare);
      }
    });
    this.formSubmitted = false;
  }

  addFare() {
    console.log('addFare called'); // Add a log to check if the function is called multiple times
    this.formSubmitted = true;
    if (this.newFare.fareName && this.newFare.fareAmount !== undefined) {
      console.log('Adding new fare:', this.newFare);
      this.carService.addFare(this.newFare).subscribe(
        (fares) => {
          console.log('Fare added successfully:', fares);
          this.Fares$.push(this.newFare);
          // this.filteredFares.push(this.newFare);
          this.newFare = new Fare();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Fare Added', life: 3000 });
          this.formSubmitted = false;
          this.addMode = false; // Reset addMode after adding a fare
        },
        (error) => {
          console.error('Error adding fare:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add fare', life: 3000 });
        }
      );
    } else {
      console.error('Fare name or amount is missing');
    }
  }

  deleteFare(fare: Fare) {
    console.log("Delete fare:", fare);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + fare.fareName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.carService.deleteFare(fare.fareId).subscribe((fares) => {
          this.Fares$ = fares;
          this.filteredFares = fares;
        });
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Fare Deleted', life: 3000 });
      }
    });
  }

  searchFares() {
    const searchTextLower = this.searchText.toLowerCase();
    this.filteredFares = this.Fares$.filter(fare => fare.fareName && fare.fareName.toLowerCase().startsWith(searchTextLower));
  }
}
