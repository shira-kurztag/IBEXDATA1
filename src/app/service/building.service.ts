import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BuildingDTO } from '../Models/BuildingDTO.model';
import { building } from '../Models/building';
 
@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private baseUrl = 'https://localhost:5178/api/Building'; 
  constructor(private http: HttpClient) {}
 
  getBuildingsByProjectId(id: number): Observable<BuildingDTO[]> {
    console.log(`${this.baseUrl}/getBuildingsByProject?id=${id}`)
    return this.http.get<BuildingDTO[]>(`${this.baseUrl}/getBuildingsByProject?id=${id}`)
  }
  getBuildingsByProjectId2(buildingNumber: string): Observable<building[]> {
    console.log(`${this.baseUrl}/getBuildingsByProject?id=${buildingNumber}`)
    return this.http.get<building[]>(`${this.baseUrl}/getBuildingsByProject?id=${buildingNumber}`)
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
 
getBuildingByBuildingNumber(buildingId: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/build/${buildingId}`);
}

Update(id: any, building: building): Observable<building> {
    const url = `${this.baseUrl}/${id}`;
    console.log("projectupdate", building);
 
    return this.http.put<building>(url, building);
  }
  
}
 