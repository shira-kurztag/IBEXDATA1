import { Component, Input } from '@angular/core';
import { ApartmentDTO } from '../../Models/ApartmentDTO.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApartmentService } from '../../service/apartment.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { ActivatedRoute } from '@angular/router';

 
@Component({
  selector: 'app-adding-apartment',
  templateUrl: './adding-apartment.component.html',
  styleUrls: ['./adding-apartment.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    CalendarModule,
    FormsModule,
  ],
  providers: [
    ConfirmationService, // הוספת ConfirmationService ל-providers
    MessageService,
    ApartmentService
  ]
})
export class AddingApartmentComponent {
  newApartment: ApartmentDTO = new ApartmentDTO();
   @Input() buildingId!: number;
 
  constructor(private apartmentService: ApartmentService,   private route: ActivatedRoute,) {} 
  onSubmit() {
    console.log('Sending apartment data:', this.newApartment);

    this.buildingId = Number(this.route.snapshot.paramMap.get('id'));
    //this.buildingId = this.buildingId;

    // this.newApartment.buildingId=2305
    this.apartmentService.addApartment(this.newApartment).subscribe(
      (response) => {
        console.log('Apartment added successfully:', response);
      },
      (error) => {
        console.error('Error adding apartment:', error);
        
       
      }
    );
  }
}