import { inject, Injectable } from '@angular/core';
import { Tenant } from '../Models/Tenant.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
 http: HttpClient = inject(HttpClient);
  constructor() { }
  BASE_URL = 'https://localhost:5178/api/Owner';
  // https://localhost:5178/api/Owner/GetOwnersByApartmentId/9983
  GetOwnersByApartmentId(id:number): Observable<Tenant[]> {

   
    return this.http.get<Tenant[]>(`${this.BASE_URL}/GetOwnersByApartmentId/${id}`);
  }
 
}
