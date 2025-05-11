import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { building } from '../Models/building';
import { BuildingDTO } from '../Models/BuildingDTO.model';
 
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

  getBuildingById(buildingId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetBuildingById/${buildingId}`);
  }
  saveBuilding(building: building): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddBuilding`, building);
}

}
