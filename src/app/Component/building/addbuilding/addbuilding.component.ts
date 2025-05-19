import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Building } from '../../../Models/Building.model';
import { FormsModule } from '@angular/forms'; // ייבוא FormsModule
import { BuildingService } from '../../../service/building.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingDTO } from '../../../Models/BuildingDTO.model';
import { FilesComponent } from '../../files/files.component';
import { Project } from '../../../Models/Project.model';

@Component({
  selector: 'app-addbuilding',
  imports: [
    CommonModule,
    FormsModule,
    FilesComponent
  ],
  templateUrl: './addbuilding.component.html',
  styleUrl: './addbuilding.component.css'
})
export class AddbuildingComponent {
    @Input() projectId!: number;
  
  IsGetFirst: boolean = true// הוספה
  building:BuildingDTO=new BuildingDTO();
  buildingNumber:string=""
  isNumberValid: boolean = true;
  isEdit: boolean = false;
  selectedFileNames: string[] = []; // רשימת שמות הקבצים שנבחרו
  project!:Project ;

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private buildingService: BuildingService
    ) {}
    isShowScrollTop = false;

    @HostListener('window:scroll', [])
    onWindowScroll() {
      // הצג כפתור רק אם גוללים לפחות 150px
      this.isShowScrollTop = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > 150;
    }
  
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    ngOnInit(): void {
      

      this.project= history.state.project;

      // this.projectId = Number(this.route.snapshot.paramMap.get('id'));
      // this.srvProject.getProjectsByContractor(this.contractorId).subscribe(Projects => {
      //   this.Projects = Projects;
      // });
    }

     // פונקציה חדשה לטיפול ב-UniqId
     onUniqIdReceived(uniqId: string): void {
    // this.contractDevelopmentFileUniqId = uniqId; // שמירת ה-UniqId שנוצר
    this.building.buildingDrawingFile= uniqId; // עדכון השדה בפרויקט
  }

  
  lookingForBuilding(){

  }
  moveMangerBulding(){

  }
  getDeleteBuildings(){

  }
apartmentList(){

}
addApartment(){

}
update(){

}
cleanFile(){
this.building=new BuildingDTO()
}
savedBuilding: any = null; // משתנה לשמירת הבניין ששמרת

addBuildSave() {
  if (!this.building) {
      console.error("No building data to save");
      return;
  }

  // הגדרת projectId
  this.building.projectId = this.projectId;

  // הגדרת buildingStatus לברירת מחדל 1
  this.building.buildingStatus = 1;

  // בדיקת הנתונים לפני השמירה
  console.log("Building data to save:", this.building);

  this.buildingService.saveBuilding(this.building).subscribe({
      next: (response: any) => {
          console.log("Building saved successfully:", response);
          this.savedBuilding = response; // שמירת הנתונים
          alert("הבניין נשמר בהצלחה!");
      },
      error: (error: any) => {
          console.error("Error saving building:", error);
          alert("שגיאה בשמירת הבניין, אנא נסה שוב.");
      }
  });
}

validateNumber(event: Event) {
  const input = event.target as HTMLInputElement;
  this.isNumberValid = /^[0-9]*$/.test(input.value);
}

onlyAllowNumbers(event: KeyboardEvent) {
  const charCode = event.charCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}
onCollectionExpensesFrom1Change() {
  if (this.building.collectionExpensesFrom1 === '') {
  }
}

onCollectionExpensesFrom2Change() {
  if (this.building.collectionExpensesFrom2 === '') {
  }
}

onCollectionExpensesFrom3Change() {
  if (this.building.collectionExpensesFrom3 === '') {
  }
}
  onModelChange(field: keyof BuildingDTO, value: any) {
    if (value === '0' || value === 0) {
      this.building = { ...this.building, [field]: null };
    } else {
      this.building = { ...this.building, [field]: value };
    }
  }
  transformValue(value: number): string {
    return value === 0 ? '' : value.toString();
  }
}
///////////