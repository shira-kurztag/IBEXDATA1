import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingService } from '../../service/building.service';
import { Building } from '../../Models/Building.model';
import { BuildingDTO } from '../../Models/BuildingDTO.model';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // ייבוא CommonModule
import { Project } from '../../Models/Project.model';

@Component({
  selector: 'app-building',
  imports: [CommonModule],
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})
export class BuildingComponent implements OnInit {
  building: any;
  buildId: number = 0;
  buildings: Building = new Building();
  flagAddGet!: string
  buildingNumber: string = ""
  IsGetFirst: boolean = true// הוספה
  IsGetSecond: boolean = false// הצגה
  build: BuildingDTO = new BuildingDTO;
  projectId:number=0
  BuildingActive: BuildingDTO[] = [];
  project!:Project ;
  constructor(
    private route: ActivatedRoute,
    public router: Router, // שונה ל-public
    private buildingService: BuildingService,
    private cdr: ChangeDetectorRef // הוספת ChangeDetectorRef

  ) { }

  ngOnInit(): void {
debugger
   
    this.project= history.state.project;


    this.flagAddGet = String(this.route.snapshot.paramMap.get('flag'));
    this.IsGetFirst = true;
    this.IsGetSecond = false;


    if (this.flagAddGet === 'false') {
      this.buildingNumber = String(this.route.snapshot.paramMap.get('number'));
      this.IsGetFirst = false;
      this.IsGetSecond = true;
      this.getBuild()
    }
    const buildingNumber = String(this.route.snapshot.paramMap.get('number'));
    if (buildingNumber) {
      this.fetchBuildingDetails(buildingNumber);
    }
    this.IsGetSecond = false;

  }
  moveMangerBulding(){

  }
  getDeleteBuildings(){

  }
  onBuildSelect(){

  }
  addApartment(){

  }
  update(){

  }
  lookingForBuilding(){

  }
  getBuild() {
    this.buildingService.getBuildingByBuildingNumber(this.buildingNumber).subscribe(data => {
      this.build = data;
      console.log("project after get", this.build);
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
}
