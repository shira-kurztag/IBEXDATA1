import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingService } from '../../service/building.service';
import { building } from '../../Models/Building.model';

@Component({
  selector: 'app-building-details',
  templateUrl: './building-details.component.html',
  styleUrls: ['./building-details.component.css']
})
export class BuildingComponent implements OnInit {
  building: any;
  buildID:any;
    buildings: building = new building();
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private buildingService: BuildingService
  ) {}

  ngOnInit(): void {
    const buildingId = this.route.snapshot.paramMap.get('id');
    if (buildingId) {
      this.fetchBuildingDetails(+buildingId);
    }
  }

  // שליפת פרטי בניין
  fetchBuildingDetails(buildingId: number): void {
    this.buildingService.getBuildingById(buildingId).subscribe(
      (data: any) => {
        this.building = data;
      },
      (error: any) => {
        console.error('Error fetching building details:', error);
      }
    );
  }
  
  onProjectSelect(event: any) {
    this.buildID = event.target.value; // עדכון ה-Project ID מהבחירה
    console.log('Selected Project ID:', this.buildID);
}
}
