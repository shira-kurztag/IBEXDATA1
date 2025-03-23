import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApartmentDTO } from '../Models/ApartmentDTO.model';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ApartmentService {
 
  private apiUrl = 'https://localhost:5178/api/ApartmentDetails/GetApartmentsByBuilding/2305'; //שליפת דירות לפי ID של בנייין
 
 
   //private apiUrlBase = 'http://localhost:5090/api/Banks'; // URL בסיסי ל-API
   
   
    constructor(private http: HttpClient) {}
   
    GetApartmentsByBuilding(buildingId: number): Observable<ApartmentDTO[]> {
      return this.http.get<ApartmentDTO[]>(this.apiUrl);
    }
   
  }
 