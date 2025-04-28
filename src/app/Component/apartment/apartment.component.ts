import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ApartmentDTO } from '../../Models/ApartmentDTO.model'; // ודא שהנתיב נכון
import { ApartmentService } from '../../service/apartment.service';

@Component({
  standalone: true,
  selector: 'app-apartment',
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
  ],
  templateUrl: './apartment.component.html',
  styleUrl: './apartment.component.css'
})
export class ApartmentComponent {
  apartment$!: ApartmentDTO[];
  buildingId: number = 0;
  carService: ApartmentService = inject(ApartmentService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  messageService: MessageService = inject(MessageService);

  newApartment: ApartmentDTO = new ApartmentDTO();

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBanks();
  }

  loadBanks() {
    this.carService.GetApartmentsByBuilding(this.buildingId).subscribe((apartments) => {
      this.apartment$ = apartments;
      console.log(apartments);
    });
  }

  onSubmit() {
    // הוספת הגשת הטופס
    console.log(this.newApartment);
  }
}
//ffgggghhsss