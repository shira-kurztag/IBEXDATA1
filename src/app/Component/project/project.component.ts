import { ChangeDetectorRef, Component, inject, OnInit, ViewChild,Output, EventEmitter } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { CommentService } from '../../service/comment.service';
import { Comment } from '../../Models/Comment.model';

import { FilesComponent } from '../files/files.component';
import { FilesService } from '../../service/files.service';
import { CommentComponent } from '../comment/comment.component';
import { LandOwnerShip } from '../../Models/LandOwnerShip.model';
import { Magardoc } from '../../Models/Magardoc.model';
// interface Column {
//   field: string;
//   header: string;
//   customExportHeader?: string;
// }

// interface ExportColumn {
//   title: string;
//   dataKey: string;
// }

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
    HttpClientModule,
    FilesComponent,
    CommentComponent
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
  companyId: number = 0;
  comNames: Contractor = new Contractor();
  comNamesString: string | undefined;
  lendingBankName: string = '';
  bankId: number = 0;
  allBanks: Bank[] = [];
  project: Project = new Project();
  projectName: string = '';
  banks: BankNamesDTO[] = [];
  bank!: BankNamesDTO;
  filteredBanks: BankNamesDTO[] = [];
  allContractors: Contractor[] = [];
  lendingContractorName: string = '';
  contractors: Contractor[] = [];
  contractorId: number | undefined;
  filteredContractors: Contractor[] = [];
  isNumberValid: boolean = true;
  degelUp: boolean = false;
  IsGetFirst: boolean = true;
  flagUpdate: boolean = false;
  IsGetSecond: boolean = false;
  showAdditionalFields: boolean = false;
  nameBank: string | undefined;
  flagAddGet!: string;
  degelUpdate: boolean = false;
  isEdit: boolean = false;
  comment: Comment = new Comment();
  commentsArr: Comment[] = [];
  commentPrev: Comment = new Comment();
  commentsPrev: Comment[] = [];
  commentFlag: boolean = false;
  idAfter: number = 0;
  commentsList: Comment[] = [];
  filteredcomment: Comment[] = [];
  comment$: Comment[] = [];
  landOwnerShips: LandOwnerShip[] = [];
  landOwnerShipName: string = '';
  namelandOwnerShip: string | undefined;
  LandOwnerShipId: number = 0;
  selectedFileNames: string[] = []; // רשימת שמות הקבצים שנבחרו
  selectedFiles: FileList = new DataTransfer().files; // רשימת הקבצים בפועל
  documentName: string = "";
  currentFieldId: string = ''; // מזהה השדה הפעיל
  filesFromChild: Magardoc[] = []; // משתנה לקליטת הקבצים
  showTable: boolean = false;
  isFileUploaded: boolean = false; // משתנה לבקרת כפתור הפעולה הנוסף
  private uniqueIdForSession: string | null = null;
  @Output() filesSelected = new EventEmitter<FileList>(); // Output להעברת רשימת הקבצים לקומפוננטה אחרת
  @Output() contractorCodeChanged = new EventEmitter<number>(); // Output להעברת contractorCode
  @Output() nameDoc = new EventEmitter<string>(); // Output להעברת רשימת הקבצים לקומפוננטה אחרת
  @ViewChild(CommentComponent) commentComponent!: CommentComponent; // קישור לקומפוננטת הבן
  @ViewChild(FilesComponent) fileComponent!: FilesComponent;
  filesArr : Magardoc[] = []
  nameDocumet: string =""

  // נתונים לשדות חוזים
  public fileData: { [key: string]: { uniqId: string; nameDoc: string } } = {};

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private projectService: ProjectService,
    private commentService: CommentService,
    private bankService: BankService,
    private fileService: FilesService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.getAllBanks();
    this.getBanks();
    this.getLandOwnerShip();
    this.getIdBank();
    this.getIdLandOwnerShip();
  
    this.flagAddGet = String(this.route.snapshot.paramMap.get('flag'));
  
    if (this.flagAddGet === 'false') {
      this.projectName = String(this.route.snapshot.paramMap.get('name'));
      this.IsGetFirst = false;
      this.IsGetSecond = true;
      this.getProject(this.projectName);
    } else {
      this.IsGetFirst = true;
      this.IsGetSecond = false;
    }
  
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('companyId', this.companyId);
  
    this.getCompanyName();
  
    if (this.isEdit) {
      this.updateProjectDatesForDisplay();
    }
  
    // אתחול נתונים עבור כל השדות
    this.fileData['contractDevelopmentFile'] = { uniqId: '', nameDoc: '' };
    this.fileData['hachiraContractFile'] = { uniqId: '', nameDoc: '' };
    this.fileData['purchaseTaxPaymentConfirmationFile'] = { uniqId: '', nameDoc: '' };
    this.fileData['appreciationTaxPaymentConfirmationFile'] = { uniqId: '', nameDoc: '' }; // שדה חדש
  }

  // עדכון ל-onUniqIdReceived
  onUniqIdReceived(uniqId: string): void {
    //if (this.currentFieldId && this.fileData[this.currentFieldId]?.nameDoc) {
      //const nameDoc = this.fileData[this.currentFieldId].nameDoc;
  
      if(uniqId != ""){
        
      switch (this.nameDocumet) {
        case 'קובץ חוזה בפיתוח':
          this.project.contractDevelopmentFile = uniqId;
          console.log('Updated project.contractDevelopmentFile with uniqId:', uniqId);
          break;
  
        case 'קובץ חוזה חכירה':
          this.project.hachiraContractFile = uniqId;
          console.log('Updated project.hachiraContractFile with uniqId:', uniqId);
          break;
  
        case 'קובץ אישור תשלום מס רכישה':
          this.project.purchaseTaxPaymentConfirmationFile = uniqId;
          console.log('Updated project.purchaseTaxPaymentConfirmationFile with uniqId:', uniqId);
          break;
  
        case 'קובץ אישור תשלום מס שבח':
          this.project.appreciationTaxPaymentConfirmationFile = uniqId;
          console.log('Updated project.appreciationTaxPaymentConfirmationFile with uniqId:', uniqId);
          break;
  
          case 'קובץ אישור תשלום מס מכירה ':
            this.project.appreciationTaxPaymentConfirmationFile = uniqId;
            console.log('Updated project.appreciationTaxPaymentConfirmationFile with uniqId:', uniqId);
            break;
    
            case 'קובץ אישור תשלום מס  ':
              this.project.salesTaxPaymentConfirmationFile = uniqId;
              console.log('Updated project.salesTaxPaymentConfirmationFile with uniqId:', uniqId);
              break;

              case 'יפוי כוח ב"ח לעורך דין מטפל ':
               this.project.powerOfAttorneyToLawyerFile = uniqId;
                console.log('Updated project.powerOfAttorneyToLawyerFile with uniqId:', uniqId);
                break;

            case 'קובץ פרצלציה':
              this.project.perselasiaFile = uniqId;
              console.log('Updated project.perselasiaFile with uniqId:', uniqId);
              break;
      
              case 'תשריט העמדה על הפרויקט':
                this.project.projectDrawingFile = uniqId;
                console.log('Updated project.projectDrawingFile with uniqId:', uniqId);
                break;
        

        default:
          console.warn('No matching field found for nameDoc:', this.nameDocumet);
      }
    } else {
      console.error('nameDoc is not defined or invalid. Unable to update project field with uniqId.');
    }
  }

onNameDocReceived(nameDoc: string): void {
  console.log('onNameDocReceived called with nameDoc:', nameDoc);
  this.nameDocumet = nameDoc

  if (this.currentFieldId && this.fileData[this.currentFieldId]) {
    this.fileData[this.currentFieldId].nameDoc = nameDoc;
    console.log(`${this.currentFieldId} nameDoc:`, nameDoc)
  }
}

  getLabelText(labelForId: string): string {
    console.log("Called getLabelText with ID:", labelForId);
    const labels = Array.from(document.querySelectorAll('label'));
    console.log("Available labels:", labels);
    const labelElement = labels.find(label => label.getAttribute('for') === this.currentFieldId);
    console.log("Found label element:", labelElement);
    return labelElement ? labelElement.textContent?.replace(':', '').trim() || '' : '';
  }


  toggleAdditionalFields() {
    this.showAdditionalFields = !this.showAdditionalFields;
  }

  getLandOwnerShip() {
    this.projectService.GetLandOwnerShip().pipe(
      tap((getLandOwnerShips: LandOwnerShip[]) => {
        this.landOwnerShips = getLandOwnerShips;
        console.log('fetching names of landOwnerShips:',this.landOwnerShips);
      }),
      catchError(error => {
        console.error('Error fetching names of landOwnerShips:', error);
        return of([]);
      })
    ).subscribe();
  }

  async getIdLandOwnerShip(){
    for (let i = 0; i < this.landOwnerShips.length; i++) {
      if (this.landOwnerShips[i].description == this.landOwnerShipName)
        this.LandOwnerShipId = this.landOwnerShips[i].id
      console.log("LandOwnerShipId", this.LandOwnerShipId);
    }
  }

  async getIdBank(): Promise<void> {
    console.log("--------getIdBank------");
 
    return new Promise<void>((resolve, reject) => {
     
      try {
        console.log("nameBank",this.lendingBankName);
        console.log("allBanks",this.allBanks);
        for (let i = 0; i < this.allBanks.length; i++) {
          if (this.allBanks[i].bankText == this.lendingBankName) {
            this.bankId = this.allBanks[i].bankId;
            console.log("bankId", this.bankId);
          }
        }
        console.log("====-0---------------============");
        resolve(); // מסיימים את ההבטחה כאשר הפעולה הסתיימה
      } catch (error) {
        console.error("Error in getIdBank:", error);
        reject(error);
      }
    });
  }


  getNameLandOwnerShip(){
    console.log("---------getNameLandOwnerShip----------");
   
    for (let i = 0; i < this.landOwnerShips.length; i++) {
      if (this.landOwnerShips[i].id == this.project.landOwnershipId)
        this.landOwnerShipName = this.landOwnerShips[i].description

      console.log("project",this.project);
      console.log(" this.project.landOwnershipId", this.project.landOwnershipId);
      console.log(this.landOwnerShips[i].id == this.project.landOwnershipId);
     
    }
    console.log("landOwnerShipName",this.landOwnerShipName);
   
  }

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

  getAllBanks() {
    console.log('Fetching  names of banks...');
    this.bankService.GetAll().pipe(
      tap((banks: Bank[]) => {
        console.log('Received  names of banks:', banks);
        this.allBanks = banks;
      }),
      catchError(error => {
        console.error('Error fetching names of banks:', error);
        return of([]);
      })
    ).subscribe();
  }

  // async getIdBank(): Promise<void> {
  //   console.log("--------getIdBank------");
 
  //   // עוטפים את הלוגיקה בהבטחה כדי להפוך את הפונקציה לאסינכרונית
  //   // return new Promise<void>((resolve, reject) => {
  //     for (let i = 0; i < this.allBanks.length; i++) {
  //       if (this.allBanks[i].bankText == this.nameBank)
  //         this.bankId = this.allBanks[i].bankId;
  //       console.log("bankId", this.bankId);
  //       console.log("====-0---------------============");
  //     }
  //     // resolve(); // מסיימים את ההבטחה כאשר הפעולה הסתיימה
  //   // });
  // }
  // async getIdBank(): Promise<void> {
  //   console.log("--------getIdBank------");
 
  //   // עוטפים את הלוגיקה בהבטחה כדי להפוך את הפונקציה לאסינכרונית
  //   return new Promise<void>((resolve, reject) => {
  //     for (let i = 0; i < this.allBanks.length; i++) {
  //       if (this.allBanks[i].bankText == this.nameBank)
  //         this.bankId = this.allBanks[i].bankId;
  //       console.log("bankId", this.bankId);
  //       console.log("====-0---------------============");
       
  //     }
  //     resolve(); // מסיימים את ההבטחה כאשר הפעולה הסתיימה
  //   });
  // }


  getNameBank(){
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
           // this.contractorId = null; // בשימוש במקרה ואין קבלן כזה
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

  async getProject(name: string) {
    try {
      const data = await this.projectService.getProjectByName(name).toPromise();
      this.project = data;
      this.getNameBank();
      this.getNameLandOwnerShip();
      console.log("project after get", this.project);
      this.IsGetSecond = true;
      this.IsGetFirst = false;
    } catch (error) {
      console.error('Error fetching project', error);
    }
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
      this.contractorId = this.comNames.contractorId
      console.log('comNamesString name:', this.comNames.contractorName);
    });
  }

  cleanFile(){
    this.project = new Project()
  }

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
   
  update() {
    this.IsGetFirst = true;
    this.IsGetSecond= false;
    this.isEdit = true;
    this.updateProjectDatesForDisplay();
  }

async update1() {
  if (this.degelUp == true) {  // רוצה למחוק את הפרויקט
    console.log("degelUp", this.degelUp);

    this.project.projectStatus = 0;

    console.log("סטטוס", this.project.projectStatus);

    this.projectService.Update(this.project.projectId, this.project).subscribe({
      next: data => {
        console.log("Data received:", data);
        this.cleanFile();
       
      },
      error: err => {
        console.error("Error occurred:", err);
      }
    });
  } else {
    console.log("------------------update-----------------");

    await this.updateProjectDates();
    await this.getIdBank();
    await this.getIdLandOwnerShip();

      this.project.lendingBank = this.bankId;
      this.project.projectStatus = 1;
      this.project.contractingCompanyId = this.companyId;
      this.project.landOwnershipId = this.LandOwnerShipId;
      console.log("project after func", this.project);

      console.log("start update");

      this.projectService.Update(this.project.projectId, this.project).subscribe({
        next: data => {
          console.log("Data received:", data);
        ///  this.commentComponent.updateComment(data.projectId)
          this.IsGetFirst = false;
          this.IsGetSecond = true;
          this.getProject(this.project.projectName)
        },
        error: err => {
          console.error("Error occurred:", err);
        }
      });
  }
}

async addProject() {
  if (this.degelUpdate == true || this.isEdit == true) {
    await this.update1();
    return;
  }

  await this.updateProjectDates();
  await this.getIdBank();
  await this.getIdLandOwnerShip();

  this.project.lendingBank = this.bankId;
  this.project.projectStatus = 1;
  this.project.contractingCompanyId = this.companyId;
  this.project.landOwnershipId = this.LandOwnerShipId;
  console.log("project after change", this.project);

  try {
    // הוספתי toPromise כדי להמתין להשלמת ה-AddProject
    const data = await this.projectService.AddProject(this.project).toPromise();
    
    console.log("Data received:", data);
    this.commentComponent.updateComment(this.project.projectId);
    this.IsGetFirst = false;
    this.IsGetSecond = true;

    // המתן לסיום getProject לפני המשך
    await this.getProject(this.project.projectName);
    
    // עדכון קבצים לאחר שסיים את הפונקציה getProject
    this.updateFiles();
    
  } catch (err) {
    console.error("Error occurred:", err);
  }
}


  updateFiles(){
    // שולחת את כל השדות קבצים לעדכון לפי UNIQI

   // this.filesArr = this.fileComponent.GetFiles(this.project.projectDrawingFile)
    // this.fileComponent.GetFiles(this.project.perselasiaFile)
    // this.fileComponent.GetFiles(this.project.powerOfAttorneyToLawyerFile)
    // this.fileComponent.GetFiles(this.project.salesTaxPaymentConfirmationFile)
    // this.fileComponent.GetFiles(this.project.appreciationTaxPaymentConfirmationFile )
    this.filesArr = this.fileComponent.GetFiles(this.project.contractDevelopmentFile)
    // this.fileComponent.GetFiles(this.project.hachiraContractFile)
    // this.fileComponent.GetFiles(this.project.purchaseTaxPaymentConfirmationFile)


    this.filesArr.forEach(file => {
      file.projectCode = this.project.projectId
      this.fileService.UpdateFile(file.id? file.id : 0, file).subscribe({
        next: data => {
          console.log("Data received succesfully:", data);
        },
        error: err => {
          console.error("Error occurred:", err);
        }
      });
    });
    // נשלח לGET לפי this.uniqueIdForSession
    // ואת מה שהתקבל לנשלח לעדכון
  }

  getComment(idAfter: bigint){
    this.commentService.GetComment(idAfter).subscribe(
      data => {
        console.log("comment after get",data);
        this.commentFlag = true
        this.commentPrev = data;
        this.commentsPrev = [...this.commentsPrev,data]
        this.commentsList = [...this.commentsList,data]
        console.log("commentsList", this.commentsList);
       
      },
      error => {
        console.error('Error fetching project', error);
      }
    );
  }
  
  async saveComment() {
   if(this.comment.commentText !=""){

    try {
      this.comment.id = BigInt(0).toString();
      this.comment.objectId = this.project.projectId;
 
      const data = await this.commentService.AddComment(this.comment).toPromise();
      console.log("Data received:", data);
      if (data) {
        // שליפת ההערה שנוצרה מהמסד
        if (data.id !== undefined) {

          const idAfter = BigInt(data.id);
          this.getComment(idAfter)
         
        } else {
          console.error("ID is undefined in received data");
        }
 
        this.comment = new Comment();
      }
    } catch (err) {
      console.error("Error occurred:", err);
    }
  }
  }

  // async updateComment(idOfProj: number){
   
  //   for (let i = 0; i < this.commentsList.length; i++) {
  //     if(this.comment.commentText !=""){
  //     this.commentsList[i].objectId = idOfProj

  //     const id = this.commentsList[i].id ?? '0';
  //     const idComment = BigInt(id);
  //     console.log("idComment",idComment);
  //     console.log("this.commentsList[i]",this.commentsList[i]);
     
     
  //     // השתמשי ב-UpdateComment עם idComment
  //     this.commentService.UpdateComment(idComment, this.commentsList[i]).subscribe(
  //       data => {
  //         console.log('Comment updated:', data);
  //       },
  //       error => {
  //         console.error('Error updating comment', error);
  //       }
  //     );
  //   }
  // }
  // }

  deleteCommentFromList(idComment: bigint) {
    for (let i = 0; i < this.commentsList.length; i++) {
      const commentId = this.commentsList[i].id;
      if (commentId !== undefined && BigInt(commentId) === idComment) {
        this.commentsList[i].commentText = "";
      }
    }
    console.log("this.commentsList after delete",this.commentsList);
   
  }
 
  deleteComment(comment: Comment) {
    if (comment.id !== undefined && comment.id !== null) {
      const id = BigInt(comment.id);
 
      this.commentService.DeleteComment((id)).subscribe(
        data => {
          console.log("Delete comment:", comment);
          this.commentsList = this.commentsList.filter(c => {
            const commentId = c.id ? BigInt(c.id) : undefined;
            return commentId !== id;
          });
          this.commentsPrev = this.commentsPrev.filter(c => {
            const commentId = c.id ? BigInt(c.id) : undefined;
            return commentId !== id;
          });
          console.log("commentsList after filter", this.commentsList);
        },
        error => {
          console.error('Error updating comment', error);
        }
      );
    } else {
      console.error('Comment id is not a valid bigint:', comment.id);
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

  private parseDate(dateString: string): Date | null {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private updateProjectDates() {
    this.project.dateWinningTender = this.formatDate(this.project.dateWinningTenderDisplay);
    this.project.developmentPeriodEndDate = this.formatDate(this.project.developmentPeriodEndDateDisplay);
    this.project.collectionExpensesFrom1 = this.formatDate(this.project.collectionExpensesFrom1Display);
    this.project.collectionExpensesFrom2 = this.formatDate(this.project.collectionExpensesFrom2Display);
    this.project.collectionExpensesFrom3 = this.formatDate(this.project.collectionExpensesFrom3Display);
    this.project.insertDate = this.formatDate(new Date());
    this.project.updateDate = this.formatDate(new Date());
    this.project.hachiraContractEndDate = this.formatDate(this.project.hachiraContractEndDateDisplay);
  }

  private updateProjectDatesForDisplay() {
    this.project.dateWinningTenderDisplay = this.parseDate(this.project.dateWinningTender);
    this.project.developmentPeriodEndDateDisplay = this.parseDate(this.project.developmentPeriodEndDate);
    this.project.collectionExpensesFrom1Display = this.parseDate(this.project.collectionExpensesFrom1);
    this.project.collectionExpensesFrom2Display = this.parseDate(this.project.collectionExpensesFrom2);
    this.project.collectionExpensesFrom3Display = this.parseDate(this.project.collectionExpensesFrom3);
    this.project.hachiraContractEndDateDisplay = this.parseDate(this.project.hachiraContractEndDate);
  }

  onDateWinningTenderChange() {
    if (this.project.dateWinningTender === '') {
      this.project.dateWinningTenderDisplay = null;
    }
  }

  onDevelopmentPeriodEndDateChange() {
    if (this.project.developmentPeriodEndDate === '') {
      this.project.developmentPeriodEndDateDisplay = null;
    }
  }

  onCollectionExpensesFrom1Change() {
    if (this.project.collectionExpensesFrom1 === '') {
      this.project.collectionExpensesFrom1Display = null;
    }
  }

  onCollectionExpensesFrom2Change() {
    if (this.project.collectionExpensesFrom2 === '') {
      this.project.collectionExpensesFrom2Display = null;
    }
  }

  onCollectionExpensesFrom3Change() {
    if (this.project.collectionExpensesFrom3 === '') {
      this.project.collectionExpensesFrom3Display = null;
    }
  }

  onHachiraContractEndDateChange() {
    if (this.project.hachiraContractEndDate === '') {
      this.project.hachiraContractEndDateDisplay = null;
    }
  }

  save(){
 
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

 
}
  // getWinningTenderDate() {
  //   return this.isEdit ? this.project.dateWinningTenderDisplay : this.project.dateWinningTender;
  // }

  // getDevelopmentPeriodEndDate() {
  //   return this.isEdit ? this.project.developmentPeriodEndDateDisplay : this.project.developmentPeriodEndDate;
  // }

  // getCollectionExpensesFrom1() {
  //   return this.isEdit ? this.project.collectionExpensesFrom1Display : this.project.collectionExpensesFrom1;
  // }

  // getCollectionExpensesFrom2() {
  //   return this.isEdit ? this.project.collectionExpensesFrom2Display : this.project.collectionExpensesFrom2;
  // }

  // getCollectionExpensesFrom3() {
  //   return this.isEdit ? this.project.collectionExpensesFrom3Display : this.project.collectionExpensesFrom3;
  // }

  // getHachiraContractEndDate() {
  //   return this.isEdit ? this.project.hachiraContractEndDateDisplay : this.project.hachiraContractEndDate;
  // }
 // delete(number : id) {
// showWarningDialog() {
  //   if (this.isIf) {
  //     this.isWarningDialogVisible = true;
  //   }
  // }

  // closeWarningDialog() {
  //   this.isWarningDialogVisible = false;
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
  // async addProject(flagUpdate: boolean) {
  //   try {
  //     await this.updateProjectDates();
  //     console.log(this.project);
  //     await this.getIdBank();
  //     this.project.lendingBank = this.bankId;
  //     this.project.projectStatus = 1;
  //     this.project.contractingCompanyId = this.companyId;

  //     if (flagUpdate) {
  //       const data = await this.projectService.Update( this.project.projectId, this.project).toPromise();
  //       console.log("Data received:", data);
       
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'הפרויקט עודכן בהצלחה!',
  //         detail: 'הפרויקט עודכן במערכת.',
  //         life: 3000
  //       });
  //     } else {
  //       const data = await this.projectService.AddProject(this.project).toPromise();
  //       console.log("Data received:", data);
       
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'הפרויקט נשמר בהצלחה!',
  //         detail: 'הפרויקט נוסף למערכת.',
  //         life: 3000
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Error occurred:", err);
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'שגיאה',
  //       detail: 'התרחשה שגיאה בעת שמירת הפרויקט.',
  //       life: 3000
  //     });
  //   }
  // }
  // update(projectId:number){
  //   console.log("הגיע",projectId);
   
  //   if (this.degelUp==true){  //רוצה למחוק את הפרויקט
  //     console.log("degelUp",this.degelUp);
  //     this.project.projectStatus = 0;
  //     console.log("סטטוס",this.project.projectStatus);  
  //     this.projectService.Update(projectId,this.project).subscribe({
  //       next: data => {
  //         console.log("Data received:", data);
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'הפרויקט נמחק בהצלחה!',
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

  //   this.updateProjectDates();
  //   this.project.lendingBank = this.bankId
  //   this.project.contractingCompanyId = this.companyId
  //   console.log('update', this.project);

  //   this.projectService.Update(this.project.projectId,this.project).subscribe({
  //     next: data => {
  //       console.log("Data received:", data);
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'הפרויקט עודכן בהצלחה!',
  //         detail: 'הפרויקט נוסף למערכת.',
  //         life: 3000
  //       });
  //     },
  //     error: err => {
  //       console.error("Error occurred:", err);
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'שגיאה',
  //         detail: 'התרחשה שגיאה בעת שמירת הפרויקט.',
  //         life: 3000
  //       });
  //     }
  //   });
  // }

  // async addProject( ) {
  //   try {
  //     await this.updateProjectDates();
     
  //     console.log(this.project);
     
  //     await this.getIdBank();
     
  //     this.project.lendingBank = this.bankId;
  //     // this.project.lendingContractorName= this.contractorId;
  //     this.project.projectStatus = 1;
  //     this.project.contractingCompanyId = this.companyId;
 
  //     const data = await this.projectService.AddProject(this.project).toPromise();
  //     console.log("Data received:", data);
     
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'הפרויקט נשמר בהצלחה!',
  //       detail: 'הפרויקט נוסף למערכת.',
  //       life: 3000
  //     });
  //   } catch (err) {
  //     console.error("Error occurred:", err);
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'שגיאה',
  //       detail: 'התרחשה שגיאה בעת שמירת הפרויקט.',
  //       life: 3000
  //     });
  //   }
  // }



  // async addProject(flagUpdate: boolean): Promise<void> {
  //   try {
  //     await this.updateProjectDates();
  //     console.log(this.project);
  //     await this.getIdBank();
  //     this.project.lendingBank = this.bankId;
  //     this.project.projectStatus = 1;
  //     this.project.contractingCompanyId = this.companyId;

  //     if (flagUpdate) {
  //       console.log("הגיע כעדכון",flagUpdate);
  //       this.update(this.project.projectId)
  //       console.log("this project update",this.project.projectId);
  //     } else {
  //       const data = await this.projectService.AddProject(this.project).toPromise();
  //       console.log("Data received:", data);
       
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'הפרויקט נשמר בהצלחה!',
  //         detail: 'הפרויקט נוסף למערכת.',
  //         life: 3000
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Error occurred:", err);
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'שגיאה',
  //       detail: 'התרחשה שגיאה בעת שמירת הפרויקט.',
  //       life: 3000
  //     });
  //   }
  // }


  // async updateProject() {
  //   try {
  //     await this.updateProjectDates();
  //     console.log(this.project);
  //     await this.getIdBank();
  //     this.project.lendingBank = this.bankId;
  //     this.project.projectStatus = 1;
  //     this.project.contractingCompanyId = this.companyId;

  //     const data = await this.projectService.Update(this.project.projectId, this.project).toPromise();
  //     console.log("Data received:", data);
     
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'הפרויקט נשמר בהצלחה!',
  //       detail: 'הפרויקט נוסף למערכת.',
  //       life: 3000
  //     });
  //   } catch (err) {
  //     console.error("Error occurred:", err);
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'שגיאה',
  //       detail: 'התרחשה שגיאה בעת שמירת הפרויקט.',
  //       life: 3000
  //     });
  //   }
  // }