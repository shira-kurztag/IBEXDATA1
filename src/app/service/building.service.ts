import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { building } from '../Models/building';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  BASE_URL= 'https://localhost:5178/api/Building/project/2226'
  https: HttpClient = inject(HttpClient);
  constructor() { }

   GetAll(): Observable<building[]> {
        console.log(`${this.BASE_URL}`);
        return this.https.get<building[]>(`${this.BASE_URL}`);
      }


  GetBuildingByProject(id: number): Observable<building[]> {
    console.log(`${this.BASE_URL}/GetProjecctByContractor?id=${id}`)
    return this.https.get<building[]>(`${this.BASE_URL}/GetBuildingByProject?id=${id}`)
  }
}
