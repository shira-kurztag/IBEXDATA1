import { Injectable } from '@angular/core';
import { BuildingDTO } from '../Models/BuildingDTO.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  constructor() { }
  
    GetProjecctByContractor(id: number): Observable< BuildingDTO> {
      console.log(`${this.BASE_URL}/GetProjecctByContractor?id=${id}`)
      return this.https.get<Project[]>(`${this.BASE_URL}/GetProjecctByContractor?id=${id}`)
    }
}
