import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private baseUrl = 'https://localhost:5178/api/Building/GetBuildingById'; // כתובת הבסיס ל-API
 
  constructor(private http: HttpClient) {}
 
  /**
   * שליפת בניינים לפי projectId
   * @param projectId מזהה הפרויקט
   * @returns Observable עם רשימת הבניינים
   */
  getBuildingsByProjectId(projectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/project/${projectId}`);
  }
 
  /**
   * שליפת פרטי בניין לפי buildingId
   * @param buildingId מזהה הבניין
   * @returns Observable עם פרטי הבניין
   */
  getBuildingById(buildingId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetBuildingById/${buildingId}`);
  }
}
 