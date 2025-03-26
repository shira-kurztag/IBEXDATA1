import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Bank } from '../../Models/Bank.model';

import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PickListModule } from 'primeng/picklist';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { CommonModule } from '@angular/common';
import { OrderListModule } from 'primeng/orderlist';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BankService } from '../../service/bank.service';

@Component({
  selector: 'app-bank',
  imports: [BreadcrumbModule,OrderListModule, PickListModule, HttpClientModule, FormsModule, ListboxModule, CommonModule, ButtonModule], // הוספת המודול ל-imports
  providers: [ConfirmationService, MessageService],
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.css'
})
export class BankComponent {
  sourceBank!: Bank[];
  targetBank!: Bank[];
  banks$!: Bank[];
  filteredBanks!: Bank[];
  bank: Bank = new Bank();
  newBank: Bank = new Bank();
  bankDialog!: boolean;
  editMode: boolean = false; // משתנה לבדיקת מצב עריכה
  editingBank: Bank | null = null; // הבנק שנמצא בעריכה כרגע
  searchText: string = ''; // טקסט החיפוש
  carService: BankService = inject(BankService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  messageService: MessageService = inject(MessageService);
  breadcrumbItems!: MenuItem[];
  constructor(
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.loadBanks(); 
   
    this.breadcrumbItems = [
      { label: 'דף הבית', url: '/' },
      { label: 'רשימת בנקים', url: '/bank' }
    ];
  }

  loadBanks() {
    this.carService.getBanks().subscribe((banks) => {
      this.banks$ = banks;
      this.filteredBanks = banks; // אתחול רשימת הבנקים המסוננים
      console.log(banks);
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode; // שינוי מצב עריכה
    if (!this.editMode) {
      this.newBank = new Bank(); // איפוס שדה הקלט כאשר יוצאים ממצב עריכה
    }
  }

  startEditingBank(bank: Bank) {
    this.editingBank = { ...bank }; // התחלת עריכת בנק
  }

  cancelEditing() {
    this.editingBank = null; // ביטול עריכת בנק
  }

  saveBank() {
    if (this.editingBank && this.editingBank.bankText) {
      this.carService.updateBank(this.editingBank.bankId, this.editingBank.bankText).subscribe(
        (banks) => {
          this.banks$ = banks;
          this.filteredBanks = banks;
          this.cancelEditing();
          this.editMode = false; // חזרה למצב ללא כפתורים
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Bank Updated', life: 3000 });
        },
        (error) => {
          console.error('Error updating bank:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update bank', life: 3000 });
        }
      );
    } else {
      console.error('Editing bank is undefined or bankText is missing');
    }
  }

  addBank() {
    if (this.newBank.bankText) {
      console.log('Adding new bank:', this.newBank); // לוג נוסף לבדיקת הנתונים הנשלחים
      this.carService.addBank(this.newBank).subscribe(
        (banks) => {
          console.log('Bank added successfully:', banks); // לוג נוסף לאחר הצלחת הבקשה
          this.banks$.push(this.newBank); // הוסף את הבנק החדש לרשימה המקומית
          this.filteredBanks = [...this.banks$]; // עדכון רשימת הבנקים המסוננים
          this.newBank = new Bank(); // איפוס שדה הקלט לאחר הוספת הבנק
          this.editMode = false; // חזרה למצב ללא כפתורי עריכה
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Bank Added', life: 3000 });
        },
        (error) => {
          console.error('Error adding bank:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add bank', life: 3000 });
        }
      );
    } else {
      console.error('Bank text is missing');
    }
  }

  searchBanks() {
    const searchTextLower = this.searchText.toLowerCase();
    this.filteredBanks = this.banks$.filter(bank => bank.bankText && bank.bankText.toLowerCase().startsWith(searchTextLower));
  }

  deleteBank(bank: Bank) {
    console.log("Deleting bank with ID:", bank.bankId);
    this.carService.deleteBank(bank.bankId).subscribe(
      () => {
        console.log('Bank deleted successfully'); // לוג נוסף לאחר הצלחת הבקשה
        this.banks$ = this.banks$.filter(b => b.bankId !== bank.bankId); // הסרת הבנק מהרשימה המקומית
        this.filteredBanks = this.filteredBanks.filter(b => b.bankId !== bank.bankId); // עדכון רשימת הבנקים המסוננים
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Bank Deleted', life: 3000 });
      },
      (error) => {
        console.error('Error deleting bank:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete bank', life: 3000 });
      }
    );
  }
}
