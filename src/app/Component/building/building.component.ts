import { ChangeDetectorRef, Component, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingService } from '../../service/building.service';
import { building } from '../../Models/building';
import { BuildingDTO } from '../../Models/BuildingDTO.model';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // ייבוא CommonModule
import { Project } from '../../Models/Project.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-building',
  imports: [CommonModule,FormsModule],
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})
export class BuildingComponent implements OnInit {
  building: any;
  buildId: number = 0;
  buildings: building = new building();
  flagAddGet!: string
  buildingId: string = ""
  IsGetFirst: boolean = true// הוספה
  IsGetSecond: boolean = false// הצגה
  projectId:number=0
  BuildingActive: BuildingDTO[] = [];
  flag!: string;
  isEdit:boolean=false;
  degelUp: boolean = false;
  selectedProjectId: any;
  degelUpdate: boolean = false;

  private parseDate(dateString: string): Date | null {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
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
  constructor(
    private route: ActivatedRoute,
    public router: Router, // שונה ל-public
    private buildingService: BuildingService,
    private cdr: ChangeDetectorRef // הוספת ChangeDetectorRef
 
  ) { }
  private updateProjectDatesForDisplay() {
    this.building.dateWinningTenderDisplay = this.parseDate(this.building.dateWinningTender);
    this.building.developmentPeriodEndDateDisplay = this.parseDate(this.building.developmentPeriodEndDate);
    this.building.collectionExpensesFrom1Display = this.parseDate(this.building.collectionExpensesFrom1);
    this.building.collectionExpensesFrom2Display = this.parseDate(this.building.collectionExpensesFrom2);
    this.building.collectionExpensesFrom3Display = this.parseDate(this.building.collectionExpensesFrom3);
    this.building.hachiraContractEndDateDisplay = this.parseDate(this.building.hachiraContractEndDate);
  }
  private updateProjectDates() {
    this.building.dateWinningTender = this.formatDate(this.building.dateWinningTenderDisplay);
    this.building.developmentPeriodEndDate = this.formatDate(this.building.developmentPeriodEndDateDisplay);
    this.building.collectionExpensesFrom1 = this.formatDate(this.building.collectionExpensesFrom1Display);
    this.building.collectionExpensesFrom2 = this.formatDate(this.building.collectionExpensesFrom2Display);
    this.building.collectionExpensesFrom3 = this.formatDate(this.building.collectionExpensesFrom3Display);
    this.building.insertDate = this.formatDate(new Date());
    this.building.updateDate = this.formatDate(new Date());
    this.building.hachiraContractEndDate = this.formatDate(this.building.hachiraContractEndDateDisplay);
  }
  ngOnInit(): void {
    this.flagAddGet = String(this.route.snapshot.paramMap.get('flag'));
    this.IsGetFirst = true;
    this.IsGetSecond = false;
 
 
    if (this.flagAddGet === 'false') {
      this.buildingId = String(this.route.snapshot.paramMap.get('number'));
      this.IsGetFirst = false;
      this.IsGetSecond = true;
      this.getBuild()
    }
    const buildingID = String(this.route.snapshot.paramMap.get('number'));
    if (buildingID) {
      this.fetchBuildingDetails(buildingID);
    }
    this.IsGetSecond = false;
  
      // קבלת הפרמטרים מה־route
      this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));
      this.buildingId = String(this.route.snapshot.paramMap.get('number'));
      this.flag = String(this.route.snapshot.paramMap.get('flag'));
  
      // הדפסה לבדיקה
      console.log('projectId:', this.projectId);
      console.log('buildingNumber:', this.buildingId);
      console.log('flag:', this.flag);
      if (this.isEdit) {
        this.updateProjectDatesForDisplay();
      }
    
  }
  moveMangerBulding(){
 
  }
  getDeleteBuildings(){
 
  }
  onBuildSelect(){
 
  }
  addApartment(){
    this.router.navigate(['/addapartment', this.building.buildingId]);
                 
  }

  startUpdate(){
    this.isEdit=true
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
    
          this.buildings.buildingStatus = 0;
    
          console.log("סטטוס", this.buildings.buildingStatus);
    
        this.buildingService.Update(this.buildings.buildingId, this.building).subscribe({
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
          // await this.getIdBank();
          // await this.getIdLandOwnerShip();
    
          // this.project.lendingBank = this.bankId;
          this.buildings.buildingStatus = 1;
          // this.project.contractingCompanyId = this.companyId;
          // this.project.landOwnershipId = this.LandOwnerShipId;
          // console.log("project after func", this.project);
    
          console.log("start update");
    
          this.buildingService.Update(this.selectedProjectId, this.building).subscribe({
            next: data => {
              console.log("Data received:", data);
            ///  this.commentComponent.updateComment(data.projectId)
              this.IsGetFirst = false;
              this.IsGetSecond = true;
              this.getBuild()
            },
            error: err => {
              console.error("Error occurred:", err);
            }
          });
        }
      }
      // async addBuilding() {
      //   // בדיקת ולידציה
      //   // if (!this.validateFields()) {
      //   //   console.error('Validation failed:', this.errorMessages);
      //   //   return; // עצור את המשך הפונקציה אם הוולידציה נכשלה
      //   // }
      //   if (this.degelUpdate == true || this.isEdit == true) {
      //     await this.update1();
      //     return;
      //   }
       
      //   await this.updateProjectDates();
      //   // await this.getIdBank();
      //   // await this.getIdLandOwnerShip();
       
      //   // this.project.lendingBank = this.bankId;
      //   this.building.buildingStatus = 1;
      //   // this.project.contractingCompanyId = this.companyId;
      //   // this.project.landOwnershipId = this.LandOwnerShipId;
       
      //   // מחיקת שדות ריקים
      //   const cleanedProject = this.cleanFile();
      //   console.log("project after cleaning", cleanedProject);
       
      //   try {
      //     const data = await this.buildingService.saveBuilding(this.building).toPromise();
         
      //     // if (data && typeof data.projectId === 'number') { // בדיקה אם data.projectId הוא מספר
      //     //   this.commentComponent.updateComment(data.projectId);
      //     // } else {
      //     //   console.error("Project ID is undefined or not a number");
      //     // }
       
      //     this.IsGetFirst = false;
      //     this.IsGetSecond = true;
      //     await this.getBuild();
      //   } catch (err) {
      //     console.error("Error occurred:", err);
      //   }
      // }
  lookingForBuilding(){
 
  }
  getBuild() {
    this.buildingService.getBuildingByBuildingNumber(this.buildingId).subscribe(data => {
      this.building = data;
      console.log("project after get", this.building);
      // לשלוף את שם הבעלות
      this.IsGetSecond = true;
      this.IsGetFirst = false;
    }, error => {
      console.error('Error fetching project', error);
    });
}
  // שליפת פרטי בניין
 
  fetchBuildingDetails(buildingNumber: string): void {
    this.buildingService.getBuildingByBuildingNumber(buildingNumber).subscribe(
      (data: any) => {
        this.building = data;
        console.log('Building data updated:', this.building);
        this.cdr.detectChanges(); // עדכון Angular כדי לזהות שינויים
      },
      (error: any) => {
        console.error('Error fetching building details:', error.message);
      }
    );
  }
  onProjectSelect(event: any) {
    this.buildId = event.target.value; // עדכון ה-Project ID מהבחירה
    console.log('Selected Project ID:', this.buildId);
  }

  save() {
    this.buildingService.Update(this.building.buildingId, this.building).subscribe({
      next: (updatedBuilding) => {
        this.building = updatedBuilding;
        this.isEdit = false; // חזרה למצב תצוגה
      },
      error: (err) => {
        // טיפול בשגיאה
        console.error(err);
      }
    });
  }
  
  cleanFile(){
    this.building = new building()
  }
}
 