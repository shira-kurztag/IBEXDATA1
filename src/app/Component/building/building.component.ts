// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { BuildingService } from '../../service/building.service';
 
// @Component({
//   selector: 'app-building-details',
//   templateUrl: './building-details.component.html',
//   styleUrls: ['./building-details.component.css']
// })
// export class BuildingComponent implements OnInit {
//   building: any;
 
//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private buildingService: BuildingService
//   ) {}
 
//   ngOnInit(): void {
//     const buildingId = this.route.snapshot.paramMap.get('id');
//     if (buildingId) {
//       this.fetchBuildingDetails(+buildingId);
//     }
//   }
 
//   // שליפת פרטי בניין
//   fetchBuildingDetails(buildingId: number): void {
//     this.buildingService.getBuildingById(buildingId).subscribe(
//       (data: any) => {
//         this.building = data;
//       },
//       (error: any) => {
//         console.error('Error fetching building details:', error);
//       }
//     );
//   }
// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BuildingService } from '../../service/building.service';

@Component({
  selector: 'app-building-details',
  templateUrl: './building-details.component.html',
  styleUrls: ['./building-details.component.css']
})
export class BuildingComponent implements OnInit {
  building: any;

  constructor(
    private route: ActivatedRoute,
    private buildingService: BuildingService
  ) {}

  ngOnInit(): void {
    const buildingId = Number(this.route.snapshot.paramMap.get('id'));
    if (buildingId) {
      this.fetchBuildingDetails(buildingId);
    } else {
      console.error('Building ID is missing or invalid');
    }
  }

  fetchBuildingDetails(buildingId: number): void {
    this.buildingService.getBuildingById(buildingId).subscribe(
      (data: any) => {
        this.building = data;
      },
      (error: any) => {
        console.error('Error fetching building details:', error);
        alert('Failed to fetch building details. Please try again later.');
      }
    );
  }
}