// import { Component, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { building } from '../../../Models/building';
// import { FormsModule } from '@angular/forms'; // ייבוא FormsModule
// import { BuildingService } from '../../../service/building.service';
// import { ActivatedRoute, Router } from '@angular/router';
 
// @Component({
//   selector: 'app-addbuilding',
//   imports: [
//     CommonModule,
//     FormsModule
//   ],
//   templateUrl: './addbuilding.component.html',
//   styleUrl: './addbuilding.component.css'
// })
// export class AddbuildingComponent {
//     @Input() projectId!: number;
 
//   IsGetFirst: boolean = true// הוספה
//   building:building=new building();
//   buildingNumber:string=""
   
//     constructor(
//       private route: ActivatedRoute,
//       private router: Router,
//       private buildingService: BuildingService
//     ) {}
//     ngOnInit(): void {
      
//       this.projectId = Number(this.route.snapshot.paramMap.get('id'));
//       // this.srvProject.getProjectsByContractor(this.contractorId).subscribe(Projects => {
//       //   this.Projects = Projects;
//       // });
//     }
 
//   lookingForBuilding(){
 
//   }
//   moveMangerBulding(){
 
//   }
//   getDeleteBuildings(){
 
//   }
// apartmentList(){
 
// }
// addApartment(){
 
// }
// update(){
 
// }
// cleanFile(){
 
// }
// addBuildSave() {
  
//   if (!this.building) {
//       console.error("No building data to save");
//       return;
//   }
//   this.building.projectId=this.projectId
//   this.buildingService.saveBuilding(this.building).subscribe({
//       next: (response: any) => {
//           console.log("Building saved successfully:", response);
//           alert("הבניין נשמר בהצלחה!");
//       },
//       error: (error: any) => {
//           console.error("Error saving building:", error);
//           alert("שגיאה בשמירת הבניין, אנא נסה שוב.");
//       }
//   });
// }
// }
 
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { building } from '../../../Models/building';
import { FormsModule } from '@angular/forms'; // ייבוא FormsModule
import { BuildingService } from '../../../service/building.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingDTO } from '../../../Models/BuildingDTO.model';

@Component({
  selector: 'app-addbuilding',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './addbuilding.component.html',
  styleUrl: './addbuilding.component.css'
})
export class AddbuildingComponent {
  @Input() projectId!: number;
 
  IsGetFirst: boolean = true; // הוספה
  building: building = new building();
  buildingNumber: string = "";
  newBuilding: building = new building();
  // getAllBuildings(projectId: number) {
  //   return this.buildingService.getBuildingsByProjectId(`/api/buildings/${projectId}`);
  // }
  buildings: BuildingDTO[] = [];
  BuildingActive: BuildingDTO[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private buildingService: BuildingService
  ) {}

  ngOnInit(): void {
    
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
  }
 
  lookingForBuilding() {
    // פונקציה לדוגמה
  }
  
  moveMangerBulding() {
    // פונקציה לדוגמה
  }
  
  cleanFile() {
    // פונקציה לדוגמה
  }



  

  onSubmit() {
    console.log('Sending building data:', this.newBuilding);
    this.newBuilding.projectId = this.projectId;

    // שמירת הבניין החדש
    this.buildingService.saveBuilding(this.newBuilding).subscribe(
      (response) => {
        console.log('Building added successfully:', response);

        // קריאה לפונקציה שמעדכנת את רשימת הבניינים
       // this.getAllBuildings();
      },
      (error) => {
        console.error('Error adding building:', error);
      }
    );
}
}