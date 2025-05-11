
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApartmentDTO } from '../Models/ApartmentDTO.model';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ApartmentService {
 
  private apiUrl = 'https://localhost:5178/api/Apartment/GetApartmentsByBuilding/2305'; //שליפת דירות לפי ID של בנייין
 
  private BASE_URL= 'https://localhost:5178/api/Apartment/2305/add-apartment';
   //private apiUrlBase = 'http://localhost:5090/api/Banks'; // URL בסיסי ל-API
   
   
    constructor(private http: HttpClient) {}
   
    GetApartmentsByBuilding(buildingId: number): Observable<ApartmentDTO[]> {
      return this.http.get<ApartmentDTO[]>(this.apiUrl);
    }
    addApartment(item: ApartmentDTO): Observable<ApartmentDTO[]> {
      var x = this.http.post<ApartmentDTO[]>(this.BASE_URL, item);
      return x;
  }
 
 
  }
 
