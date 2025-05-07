import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ownerDTO2 } from '../Models/ownerDTO2.model';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  constructor() { }

 
  
    BASE_URL = 'https://localhost:5178/api/Owner';
  
  
    http: HttpClient = inject(HttpClient);
  
    GetOwnerByApartmentId(ApartmentId: number): Observable<number> {
      return this.http.get<number>(`${this.BASE_URL}/GetOwnerByApartmentId/${ApartmentId}`);
    }
}
