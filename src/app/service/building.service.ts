import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BuildingDTO } from '../Models/BuildingDTO.model';
import { Building } from '../Models/Building.model';
 
@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private baseUrl = 'https://localhost:5178/api/Building'; // כתובת הבסיס ל-API
  constructor(private http: HttpClient) {}
 
  getBuildingsByProjectId(id: number): Observable<BuildingDTO[]> {
    console.log(`${this.baseUrl}/getBuildingsByProject?id=${id}`)
    return this.http.get<BuildingDTO[]>(`${this.baseUrl}/getBuildingsByProject?id=${id}`)
  }
  getBuildingsByProjectId2(buildingNumber: string): Observable<Building[]> {
    console.log(`${this.baseUrl}/getBuildingsByProject?id=${buildingNumber}`)
    return this.http.get<Building[]>(`${this.baseUrl}/getBuildingsByProject?id=${buildingNumber}`)
  }
  getBuildingById(buildingId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetBuildingById/${buildingId}`);
  }
  saveBuilding(building: BuildingDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddBuilding`, building);
}
 // service: building.service.ts
getAllBuildingsByProjectId(projectId: number): Observable<BuildingDTO[]> {
    return this.http.get<BuildingDTO[]>(`${this.baseUrl}/getBuildingsByProject?id=${projectId}`);
}

getBuildingByBuildingNumber(buildingNumber: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/build/${buildingNumber}`);
}
}