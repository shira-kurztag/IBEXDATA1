import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { Table } from 'primeng/table';
import { Project } from '../../Models/Project.model';
import { ProjectService } from '../../service/project.service';
import { ProjectDTO } from '../../Models/ProjectDTO.model';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ProjectCreateDTO } from '../../Models/ProjectCreateDTO.model';
import { catchError, of, tap } from 'rxjs';
import { Contractor } from '../../Models/Contractor.model';
import { Bank } from '../../Models/Bank.model';
import { BankService } from '../../service/bank.service';
import { BankNamesDTO } from '../../Models/BankNamesDTO.model';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-project-component',
  templateUrl: './project.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    RippleModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    InputTextModule,
    TextareaModule,
    FileUploadModule,
    SelectButtonModule,
    TagModule,
    RadioButtonModule,
    RatingModule,
    InputNumberModule,
    TableModule,
    CalendarModule,
    CheckboxModule,
    HttpClientModule
  ],
  providers: [MessageService, ConfirmationService],
  styles: [
    `:host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
    }`
  ],
  styleUrls: ['./project.component.css']
})

export class ProjectComponent implements OnInit {
  productDialog: boolean = false;
  submitted: boolean = false;
  statuses!: any[];
  @ViewChild('dt') dt!: Table;
  isWarningDialogVisible: boolean = false;
  isIf: boolean = true; // או false בהתאם ללוגיקה שלך
  cols!: Column[];
  exportColumns!: ExportColumn[];
  companyId: number=0
  comNames: Contractor = new Contractor()
  comNamesString : string=""
  bankService: BankService = inject(BankService);
  lendingBankName : string =""
  bankId : number=0
  allBanks: Bank[] = [];
  project: Project = new Project();
  projectName: string ="";
  banks: BankNamesDTO[] = [];
  bank!: BankNamesDTO;
  filteredBanks: BankNamesDTO[] = []
  allContractors: Contractor[] = [];
  lendingContractorName: string = '';
  contractors: Contractor[] = [];
  contractorId: number | null = null; // אתחול לא null
  filteredContractors: Contractor[] = [];
  isNumberValid: boolean = true;
  projId: number = 2251
  degelUp :boolean=false;
  projId1: number = 2278;
  IsGetFirst: boolean = true
  IsGetSecond: boolean = false
  showAdditionalFields: boolean = false;
  nameBank: string=""

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef, 
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.companyId = 1119
    this.getCompanyName()
    this.getBanks();
    this.getIdBank();
  }

  toggleAdditionalFields() {
    this.showAdditionalFields = !this.showAdditionalFields;
  }

  save(){
  
  }

  // שליפת שם הבנק לפי הID
  // נרוץ על רשימת בהנקים ואם הID שווה לAID אז מציג את השם

  getBanks() {
    console.log('Fetching  names of banks...');
    this.bankService.GetNames().pipe(
      tap((banks: BankNamesDTO[]) => {
        console.log('Received  names of banks:', banks);
        this.banks = banks;
        this.filteredBanks = banks.filter(bank => bank.bankText); // סינון הבנקים שאינם NULL
        this.cd.detectChanges();
      }),
      catchError(error => {
        console.error('Error fetching names of banks:', error);
        return of([]);
      })
    ).subscribe();
  }

  getIdBank(){
    console.log('Fetching banks...');
    this.bankService.GetAll().pipe(
      tap((banks: Bank[]) => {
        console.log('Received banks:', banks);
        this.allBanks = banks
       for (let i = 0; i < this.allBanks.length; i++) {
         if( this.allBanks[i].bankText == this.lendingBankName)
          this.bankId = this.allBanks[i].bankId 
        console.log("jjh",this.allBanks[i].bankId );
         console.log("bankid",this.bankId);
        
       }
       // this.cd.detectChanges();
      }),
      catchError(error => {
        console.error('Error fetching banks:', error);
        return of([]);
      })
    ).subscribe();
  }

  getNameBank(){
    console.log("getNameBank");
    
    for (let i = 0; i < this.allBanks.length; i++) {
      if (this.allBanks[i].bankId == this.project.lendingBank)
        this.nameBank = this.allBanks[i].bankText
        console.log("name",this.nameBank); 
    }
  }

  GetContractor(contractorName: string) {
    console.log('Fetching contractors...');
    this.projectService.GetAll().pipe(
      tap((contractors: Contractor[]) => {
        console.log('Received contractors:', contractors);
        this.contractors = contractors;

        // חיפוש הקבלן על פי השם שניתן
        const contractorFound = contractors.find(contractor => contractor.contractorName === contractorName);
        if (contractorFound) {
            this.contractorId = contractorFound.contractorId // קבלת ה-ID של הקבלן
            console.log('Contractor ID:', this.contractorId);
        } else {
            console.log('Contractor not found');
            this.contractorId = null; // בשימוש במקרה ואין קבלן כזה
        }

        this.cd.detectChanges();
      }),
      catchError(error => {
        console.error('Error fetching contractors:', error);
        return of([]);
      })
    ).subscribe();
}

getIdContractor() {
    console.log('Fetching contractors...');
    this.projectService.GetAll().pipe(
      tap((contractors: Contractor[]) => {
        console.log('Received contractors:', contractors);
        this.allContractors = contractors; // מאחסנים את רשימת הקבלנים

        for (let i = 0; i < this.allContractors.length; i++) {
          if (this.allContractors[i].contractorName === this.lendingContractorName) { // השוואה לשם הקבלן המבוקש
            this.contractorId = this.allContractors[i].contractorId; // שמירת ה-ID של הקבלן
            console.log("Contractor ID:", this.contractorId);
          }
        }

        // this.cd.detectChanges(); // ניתן להשתמש אם יש צורך
      }),
      catchError(error => {
        console.error('Error fetching contractors:', error);
        return of([]); // החזרת Observable ריק במקרה של שגיאה
      })
    ).subscribe();
}

  getProject() {
    this.projectService.getProjectByName(this.projectName).subscribe(data => {
    this.project = data;
    console.log("go to getNameBank");
    
     this.getNameBank()
    this.IsGetSecond = true
    this.IsGetFirst = false
    console.log("id",  this.IsGetSecond);
    console.log("p",this.project);
    console.log("trytr",this.project.dateWinningTender);

  }, error => {
    console.error('Error fetching project', error);
  });
}

  getCompanyName() {
    this.projectService.GetCompanyById(this.companyId).pipe(
      catchError(error => {
        console.error('Error fetching company name:', error);  // הדפס את השגיאה
        return of(new Contractor());  // החזר אובייקט ריק במקרה של שגיאה
      })
    ).subscribe((comNames: Contractor) => {
      this.comNames = comNames;
      console.log('Company name:', comNames);
      this.comNamesString = this.comNames.contractorName;
      console.log('comNamesString name:', this.comNames.contractorName);
    });
  }

  cleanFile(){
    this.project = new Project() 
  }

  // delete(number : id) {
  //   this.project.projectStatus = 0;

  //   // קריאה לשירות לעדכון הפרויקט עם ה-ID
  //   this.projectService.Update(this.projId, this.project).subscribe({
  //     next: data => {
  //       console.log("Project status updated:", data);
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'הפרויקט עודכן בהצלחה!',
  //         detail: 'סטטוס הפרויקט שונה למחקה.',
  //         life: 3000
  //       });
  //     },
  //     error: err => {
  //       console.error("Error occurred:", err);
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'שגיאה',
  //         detail: 'התרחשה שגיאה בעת עדכון הסטטוס של הפרויקט.',
  //         life: 3000
  //       });
  //     }
  //   });
  // }

  

  //update(id: number){
  
  delete(){
  this.degelUp=true;
  this.update();
  }
  update(){
    if (this.degelUp==true){  //רוצה למחוק את הפרויקט
      console.log("degelUp",this.degelUp);
      this.project.projectStatus = 0;
      console.log("סטטוס",this.project.projectStatus);  
      this.projectService.Update(this.projId1,this.project).subscribe({
        next: data => {
          console.log("Data received:", data);
          this.messageService.add({
            severity: 'success',
            summary: 'הפרויקט נמחק בהצלחה!',
            detail: 'הפרויקט נוסף למערכת.',
            life: 3000
          });
        },
        error: err => {
          console.error("Error occurred:", err);
          this.messageService.add({
            severity: 'error',
            summary: 'שגיאה',
            detail: 'התרחשה שגיאה בעת שמירת הפרויקט.',
            life: 3000
          });
        }
      });
    }
    this.updateProjectDates();
    this.project.lendingBank = this.bankId
    this.project.contractingCompanyId = this.companyId
    console.log('update', this.project);

    this.projectService.Update(this.projId1,this.project).subscribe({
      next: data => {
        console.log("Data received:", data);
        this.messageService.add({
          severity: 'success',
          summary: 'הפרויקט עודכן בהצלחה!',
          detail: 'הפרויקט נוסף למערכת.',
          life: 3000
        });
      },
      error: err => {
        console.error("Error occurred:", err);
        this.messageService.add({
          severity: 'error',
          summary: 'שגיאה',
          detail: 'התרחשה שגיאה בעת שמירת הפרויקט.',
          life: 3000
        });
      }
    });
  }

  async addProject() {
    try {
      await this.updateProjectDates(); 
      
      console.log(this.project);
      
      await this.getIdBank();
      
      this.project.lendingBank = this.bankId;
      // this.project.lendingContractorName= this.contractorId;
      this.project.projectStatus = 1;
      this.project.contractingCompanyId = this.companyId;
  
      const data = await this.projectService.AddProject(this.project).toPromise();
      console.log("Data received:", data);
      
      this.messageService.add({
        severity: 'success',
        summary: 'הפרויקט נשמר בהצלחה!',
        detail: 'הפרויקט נוסף למערכת.',
        life: 3000
      });
    } catch (err) {
      console.error("Error occurred:", err);
      this.messageService.add({
        severity: 'error',
        summary: 'שגיאה',
        detail: 'התרחשה שגיאה בעת שמירת הפרויקט.',
        life: 3000
      });
    }
  }

  private formatDate(date: any): string {
    if (!date) return ''; // בדיקה אם התאריך אינו תקף
    if (typeof date === 'string') {
      const [day, month, year] = date.split('-');
      date = new Date(`${year}-${month}-${day}`);
    }
    if (date.toString() === 'Invalid Date') return ''; // בדיקה אם התאריך אינו תקף לאחר ההמרה
    return date.toISOString().split('T')[0];
  }

  private updateProjectDates() {
    this.project.dateWinningTender = this.formatDate(this.project.dateWinningTender);
    this.project.developmentPeriodEndDate = this.formatDate(this.project.developmentPeriodEndDate);
    this.project.collectionExpensesFrom1 = this.formatDate(this.project.collectionExpensesFrom1);
    this.project.collectionExpensesFrom2 = this.formatDate(this.project.collectionExpensesFrom2);
    this.project.collectionExpensesFrom3 = this.formatDate(this.project.collectionExpensesFrom3);
    this.project.insertDate = this.formatDate(new Date());
    this.project.updateDate = this.formatDate(new Date());
    this.project.hachiraContractEndDate = this.formatDate(this.project.hachiraContractEndDate);
  }

  addBuilding(){

  }

  getBuildings(){

  }

  getDeleteBuildings(){
    
  }

  moveManger(){

  }

  moveMangerBulding(){

  }

  lookingFor(){

  }

  lookingForBuilding(){

  }

  exportCSV() {
    this.dt.exportCSV();
  }

  onlyAllowNumbers(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  validateNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    this.isNumberValid = /^[0-9]*$/.test(input.value);
  }

  onModelChange(field: keyof ProjectDTO, value: any) {
    if (value === '0' || value === 0) {
      this.project = { ...this.project, [field]: null };
    } else {
      this.project = { ...this.project, [field]: value };
    }
  }

  transformValue(value: number): string {
  return value === 0 ? '' : value.toString();
  }

  hideDialog() {
    this.productDialog = true;
    this.submitted = true;
  }

  showWarningDialog() {
    if (this.project.isPrepareWarningComment) {
      this.isWarningDialogVisible = true;
    }
  }

  closeWarningDialog() {
    this.isWarningDialogVisible = false;
    this.project.isPrepareWarningComment = false;
  }

  // showWarningDialog() {
  //   if (this.isIf) {
  //     this.isWarningDialogVisible = true;
  //   }
  // }

  // closeWarningDialog() {
  //   this.isWarningDialogVisible = false;
  // }
}

// import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
// import { ConfirmationService, MessageService } from 'primeng/api';
// import { TableModule } from 'primeng/table';
// import { DialogModule } from 'primeng/dialog';
// import { RippleModule } from 'primeng/ripple';
// import { ButtonModule } from 'primeng/button';
// import { ToastModule } from 'primeng/toast';
// import { ToolbarModule } from 'primeng/toolbar';
// import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { InputTextModule } from 'primeng/inputtext';
// import { TextareaModule } from 'primeng/textarea';
// import { CommonModule } from '@angular/common';
// import { FileUploadModule } from 'primeng/fileupload';
// import { SelectButtonModule } from 'primeng/selectbutton';
// import { TagModule } from 'primeng/tag';
// import { RadioButtonModule } from 'primeng/radiobutton';
// import { RatingModule } from 'primeng/rating';
// import { FormsModule } from '@angular/forms';
// import { InputNumberModule } from 'primeng/inputnumber';
// import { CalendarModule } from 'primeng/calendar';
// import { CheckboxModule } from 'primeng/checkbox';
// import { Table } from 'primeng/table';
// import { Project } from '../../Models/Project.model';
// import { ProjectService } from '../../service/project.service';
// import { ProjectDTO } from '../../Models/ProjectDTO.model';
// import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
// import { ProjectCreateDTO } from '../../Models/ProjectCreateDTO.model';

// interface Column {
//   field: string;
//   header: string;
//   customExportHeader?: string;
// }

// interface ExportColumn {
//   title: string;
//   dataKey: string;
// }

// @Component({
//   selector: 'app-project-component',
//   templateUrl: './project.component.html',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     DialogModule,
//     RippleModule,
//     ButtonModule,
//     ToastModule,
//     ToolbarModule,
//     ConfirmDialogModule,
//     InputTextModule,
//     TextareaModule,
//     FileUploadModule,
//     SelectButtonModule,
//     TagModule,
//     RadioButtonModule,
//     RatingModule,
//     InputNumberModule,
//     TableModule,
//     CalendarModule,
//     CheckboxModule,
//     HttpClientModule
//   ],
//   providers: [MessageService, ConfirmationService],
//   styles: [
//     `:host ::ng-deep .p-dialog .product-image {
//       width: 150px;
//       margin: 0 auto 2rem auto;
//       display: block;
//     }`
//   ],
//   styleUrls: ['./project.component.css']
// })
// export class ProjectComponent implements OnInit {
//   productDialog: boolean = false;
//   submitted: boolean = false;
//   statuses!: any[];
//   @ViewChild('dt') dt!: Table;
//   isWarningDialogVisible: boolean = false;
//   isIf: boolean = true; // או false בהתאם ללוגיקה שלך

//   cols!: Column[];
//   exportColumns!: ExportColumn[];

//   // project: ProjectCreateDTO = new ProjectCreateDTO();
//   project: Project = new Project();

//   constructor(
//     private messageService: MessageService,
//     private confirmationService: ConfirmationService,
//     private cd: ChangeDetectorRef, private projectService: ProjectService
//   ) { }

//   ngOnInit() {}

//   private formatDate(date: any): string {
//     if (!date) return ''; // בדיקה אם התאריך אינו תקף
//     if (typeof date === 'string') {
//       date = new Date(date.split('-').reverse().join('-'));
//     }
//     if (date.toString() === 'Invalid Date') return ''; // בדיקה אם התאריך אינו תקף לאחר ההמרה
//     return date.toISOString().split('T')[0];
//   }

//   private updateProjectDates() {
//     this.project.dateWinningTender = this.formatDate(this.project.dateWinningTender);
//     this.project.developmentPeriodEndDate = this.formatDate(this.project.developmentPeriodEndDate);
//     this.project.collectionExpensesFrom1 = this.formatDate(this.project.collectionExpensesFrom1);
//     this.project.collectionExpensesFrom2 = this.formatDate(this.project.collectionExpensesFrom2);
//     this.project.collectionExpensesFrom3 = this.formatDate(this.project.collectionExpensesFrom3);
//     this.project.insertDate = this.formatDate(new Date());
//     this.project.updateDate = this.formatDate(new Date());
//     this.project.hachiraContractEndDate = this.formatDate(this.project.hachiraContractEndDate);
//   }

//   addProject() {
//     this.updateProjectDates();
//     console.log(this.project);

//     this.projectService.add(this.project).subscribe({
//       next: data => {
//         console.log("Data received:", data);
//         this.messageService.add({
//           severity: 'success',
//           summary: 'הפרויקט נשמר בהצלחה!',
//           detail: 'הפרויקט נוסף למערכת.',
//           life: 3000
//         });
//       },
//       error: err => {
//         console.error("Error occurred:", err);
//         this.messageService.add({
//           severity: 'error',
//           summary: 'שגיאה',
//           detail: 'התרחשה שגיאה בעת שמירת הפרויקט.',
//           life: 3000
//         });
//       }
//     });
//   }

//   exportCSV() {
//     this.dt.exportCSV();
//   }

//   // openNew() {
//   //   this.project = new ProjectDTO();
//   //   this.addProject();
//   //   this.submitted = false;
//   //   this.productDialog = true;
//   // }

//   hideDialog() {
//     this.productDialog = true;
//     this.submitted = true;
//   }

//   saveProduct() {
//     this.submitted = true;
//     this.messageService.add({
//       severity: 'success',
//       summary: 'Successful',
//       detail: 'Product Updated',
//       life: 3000
//     });
//     this.messageService.add({
//       severity: 'success',
//       summary: 'Successful',
//       detail: 'Product Created',
//       life: 3000
//     });
//   }

//   showWarningDialog() {
//     if (this.isIf) {
//       this.isWarningDialogVisible = true;
//     }
//   }

//   closeWarningDialog() {
//     this.isWarningDialogVisible = false;
//   }
// }

// import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
// import { ConfirmationService, MessageService } from 'primeng/api';
// import { TableModule } from 'primeng/table';
// import { DialogModule } from 'primeng/dialog';
// import { RippleModule } from 'primeng/ripple';
// import { ButtonModule } from 'primeng/button';
// import { ToastModule } from 'primeng/toast';
// import { ToolbarModule } from 'primeng/toolbar';
// import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { InputTextModule } from 'primeng/inputtext';
// import { TextareaModule } from 'primeng/textarea';
// import { CommonModule } from '@angular/common';
// import { FileUploadModule } from 'primeng/fileupload';
// import { SelectButtonModule } from 'primeng/selectbutton';
// import { TagModule } from 'primeng/tag';
// import { RadioButtonModule } from 'primeng/radiobutton';
// import { RatingModule } from 'primeng/rating';
// import { FormsModule } from '@angular/forms';
// import { InputNumberModule } from 'primeng/inputnumber';
// import { CalendarModule } from 'primeng/calendar';
// import { CheckboxModule } from 'primeng/checkbox';
// import { Table } from 'primeng/table';
// import { Project } from '../../Models/Project.model';
// import { ProjectService } from '../../service/project.service';
// import { ProjectDTO } from '../../Models/ProjectDTO.model';
// import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
// import { ProjectCreateDTO } from '../../Models/ProjectCreateDTO.model';


// interface Column {
//   field: string;
//   header: string;
//   customExportHeader?: string;
// }

// interface ExportColumn {
//   title: string;
//   dataKey: string;
// }


// @Component({
//   selector: 'app-project-component',
//   templateUrl: './project.component.html',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     DialogModule,
//     RippleModule,
//     ButtonModule,
//     ToastModule,
//     ToolbarModule,
//     ConfirmDialogModule,
//     InputTextModule,
//     TextareaModule,
//     FileUploadModule,
//     SelectButtonModule,
//     TagModule,
//     RadioButtonModule,
//     RatingModule,
//     InputNumberModule,
//     TableModule,
//     CalendarModule,
//     CheckboxModule,
//     HttpClientModule
//   ],
//   providers: [MessageService, ConfirmationService],
//   styles: [
//     `:host ::ng-deep .p-dialog .product-image {
//       width: 150px;
//       margin: 0 auto 2rem auto;
//       display: block;
//     }`
//   ],
//   styleUrls: ['./project.component.css']
// })
// export class ProjectComponent implements OnInit {
//   productDialog: boolean = false;
//   submitted: boolean = false;
//   statuses!: any[];
//   @ViewChild('dt') dt!: Table;
//   isWarningDialogVisible: boolean = false;
//   isIf: boolean = true; // או false בהתאם ללוגיקה שלך

//   cols!: Column[];
//   exportColumns!: ExportColumn[];

//   // project: ProjectCreateDTO = new ProjectCreateDTO();
//   project: Project = new Project();

//   constructor(
//     private messageService: MessageService,
//     private confirmationService: ConfirmationService,
//     private cd: ChangeDetectorRef, private projectService: ProjectService
//   ) { }

//   ngOnInit() {
   
//   }
  
//   private formatDate(date: Date): string {
//     return date.toISOString().split('T')[0];
//   }

//   private updateProjectDates() {
//     this.project.dateWinningTender = this.formatDate(new Date(this.project.dateWinningTender));
//     this.project.developmentPeriodEndDate = this.formatDate(new Date(this.project.developmentPeriodEndDate));
//     this.project.collectionExpensesFrom1 = this.formatDate(new Date(this.project.collectionExpensesFrom1));
//     this.project.collectionExpensesFrom2 = this.formatDate(new Date(this.project.collectionExpensesFrom2));
//     this.project.collectionExpensesFrom3 = this.formatDate(new Date(this.project.collectionExpensesFrom3));
//     this.project.insertDate = this.formatDate(new Date());
//     this.project.updateDate = this.formatDate(new Date());
//     this.project.hachiraContractEndDate = this.formatDate(new Date(this.project.hachiraContractEndDate));
//   }

//   addProject() {
//     this.updateProjectDates();
//     console.log(this.project);

//     this.projectService.add(this.project).subscribe({
//       next: data => {
//         console.log("Data received:", data);
//         this.messageService.add({
//           severity: 'success',
//           summary: 'הפרויקט נשמר בהצלחה!',
//           detail: 'הפרויקט נוסף למערכת.',
//           life: 3000
//         });
//       },
//       error: err => {
//         console.error("Error occurred:", err);
//         this.messageService.add({
//           severity: 'error',
//           summary: 'שגיאה',
//           detail: 'התרחשה שגיאה בעת שמירת הפרויקט.',
//           life: 3000
//         });
//       }
//     });
//   }

//   // addProject() {
//   //   this.project.insertDate = new Date();
//   //   console.log(this.project);
    

//   //   this.projectService.add(this.project).subscribe({
//   //     next: data => {
//   //       console.log("Data received:", data);
//   //       this.messageService.add({
//   //         severity: 'success',
//   //         summary: 'הפרויקט נשמר בהצלחה!',
//   //         detail: 'הפרויקט נוסף למערכת.',
//   //         life: 3000
//   //       });
//   //     },
//   //     error: err => {
//   //       console.error("Error occurred:", err);
//   //       this.messageService.add({
//   //         severity: 'error',
//   //         summary: 'שגיאה',
//   //         detail: 'התרחשה שגיאה בעת שמירת הפרויקט.',
//   //         life: 3000
//   //       });
//   //     }
//   //   });
//   // }

//   exportCSV() {
//     this.dt.exportCSV();
//   }

//   // openNew() {
//   //   this.project = new ProjectDTO();
//   //   this.addProject();
//   //   this.submitted = false;
//   //   this.productDialog = true;
//   // }

//   hideDialog() {
//     this.productDialog = true;
//     this.submitted = true;
//   }

//   saveProduct() {
//     this.submitted = true;
//     this.messageService.add({
//       severity: 'success',
//       summary: 'Successful',
//       detail: 'Product Updated',
//       life: 3000
//     });
//     this.messageService.add({
//       severity: 'success',
//       summary: 'Successful',
//       detail: 'Product Created',
//       life: 3000
//     });
//   }


//   showWarningDialog() {
//     if (this.isIf) {
//       this.isWarningDialogVisible = true;
//     }
//   }

//   closeWarningDialog() {
//     this.isWarningDialogVisible = false;
//   }

// }

//part 2

// @Component({
//   selector: 'app-project-component',
//   templateUrl: './project.component.html',
//   standalone: true,
//   providers: [MessageService, ConfirmationService],
//   styleUrls: ['./project.component.css']
// })
// export class ProjectComponent implements OnInit {
//   productDialog: boolean = false;
//   submitted: boolean = false;
//   statuses!: any[];
//   @ViewChild('dt') dt!: Table;
//   isWarningDialogVisible: boolean = false;
//   isIf: boolean = true;

//   cols!: Column[];
//   exportColumns!: ExportColumn[];

//   project: Project = new Project();

//   constructor(
//     private messageService: MessageService,
//     private confirmationService: ConfirmationService,
//     private projectService: ProjectService
//   ) {}

//   ngOnInit() {}

//   private formatDate(date: Date): string {
//     return date.toISOString().split('T')[0];
//   }

//   private updateProjectDates() {
//     this.project.dateWinningTender = this.formatDate(new Date(this.project.dateWinningTender));
//     this.project.developmentPeriodEndDate = this.formatDate(new Date(this.project.developmentPeriodEndDate));
//     this.project.collectionExpensesFrom1 = this.formatDate(new Date(this.project.collectionExpensesFrom1));
//     this.project.collectionExpensesFrom2 = this.formatDate(new Date(this.project.collectionExpensesFrom2));
//     this.project.collectionExpensesFrom3 = this.formatDate(new Date(this.project.collectionExpensesFrom3));
//     this.project.insertDate = this.formatDate(new Date());
//     this.project.updateDate = this.formatDate(new Date());
//     this.project.hachiraContractEndDate = this.formatDate(new Date(this.project.hachiraContractEndDate));
//   }

//   addProject() {
//     this.updateProjectDates();
//     console.log(this.project);

//     this.projectService.add(this.project).subscribe({
//       next: data => {
//         console.log("Data received:", data);
//         this.messageService.add({
//           severity: 'success',
//           summary: 'הפרויקט נשמר בהצלחה!',
//           detail: 'הפרויקט נוסף למערכת.',
//           life: 3000
//         });
//       },
//       error: err => {
//         console.error("Error occurred:", err);
//         this.messageService.add({
//           severity: 'error',
//           summary: 'שגיאה',
//           detail: 'התרחשה שגיאה בעת שמירת הפרויקט.',
//           life: 3000
//         });
//       }
//     });
//   }

//   exportCSV() {
//     this.dt.exportCSV();
//   }

//   hideDialog() {
//     this.productDialog = true;
//     this.submitted = true;
//   }

//   saveProduct() {
//     this.submitted = true;
//     this.messageService.add({
//       severity: 'success',
//       summary: 'Successful',
//       detail: 'Product Updated',
//       life: 3000
//     });
//     this.messageService.add({
//       severity: 'success',
//       summary: 'Successful',
//       detail: 'Product Created',
//       life: 3000
//     });
//   }

//   showWarningDialog() {
//     if (this.isIf) {
//       this.isWarningDialogVisible = true;
//     }
//   }

//   closeWarningDialog() {
//     this.isWarningDialogVisible = false;
//   }
// }


// @Component({
//   selector: 'app-project-component',
//   templateUrl: './project.component.html',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     DialogModule,
//     RippleModule,
//     ButtonModule,
//     ToastModule,
//     ToolbarModule,
//     ConfirmDialogModule,
//     InputTextModule,
//     TextareaModule,
//     FileUploadModule,
//     SelectButtonModule,
//     TagModule,
//     RadioButtonModule,
//     RatingModule,
//     InputNumberModule,
//     TableModule,
//     CalendarModule,
//     CheckboxModule,
//     HttpClientModule
//   ],
//   providers: [MessageService, ConfirmationService],
//   styles: [
//     `:host ::ng-deep .p-dialog .product-image {
//       width: 150px;
//       margin: 0 auto 2rem auto;
//       display: block;
//     }`
//   ],
//   styleUrls: ['./project.component.css']
// })
// export class ProjectComponent implements OnInit {
//   productDialog: boolean = false;
//   submitted: boolean = false;
//   statuses!: any[];
//   @ViewChild('dt') dt!: Table;
//   isWarningDialogVisible: boolean = false;
//   isIf: boolean = true; // או false בהתאם ללוגיקה שלך

//   cols!: Column[];
//   exportColumns!: ExportColumn[];

//   // project: ProjectCreateDTO = new ProjectCreateDTO();
//   project: Project = new Project();

//   constructor(
//     private messageService: MessageService,
//     private confirmationService: ConfirmationService,
//     private cd: ChangeDetectorRef, private projectService: ProjectService
//   ) { }

//   ngOnInit() {
   
//   }

//   //

//   addProject() {
//     this.project.insertDate = new Date();
//     console.log(this.project);
    

//     this.projectService.add(this.project).subscribe({
//       next: data => {
//         console.log("Data received:", data);
//         this.messageService.add({
//           severity: 'success',
//           summary: 'הפרויקט נשמר בהצלחה!',
//           detail: 'הפרויקט נוסף למערכת.',
//           life: 3000
//         });
//       },
//       error: err => {
//         console.error("Error occurred:", err);
//         this.messageService.add({
//           severity: 'error',
//           summary: 'שגיאה',
//           detail: 'התרחשה שגיאה בעת שמירת הפרויקט.',
//           life: 3000
//         });
//       }
//     });
//   }

//   exportCSV() {
//     this.dt.exportCSV();
//   }

//   // openNew() {
//   //   this.project = new ProjectDTO();
//   //   this.addProject();
//   //   this.submitted = false;
//   //   this.productDialog = true;
//   // }

//   hideDialog() {
//     this.productDialog = true;
//     this.submitted = true;
//   }

//   saveProduct() {
//     this.submitted = true;
//     this.messageService.add({
//       severity: 'success',
//       summary: 'Successful',
//       detail: 'Product Updated',
//       life: 3000
//     });
//     this.messageService.add({
//       severity: 'success',
//       summary: 'Successful',
//       detail: 'Product Created',
//       life: 3000
//     });
//   }


//   showWarningDialog() {
//     if (this.isIf) {
//       this.isWarningDialogVisible = true;
//     }
//   }

//   closeWarningDialog() {
//     this.isWarningDialogVisible = false;
//   }

// }


