import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OwnerDTO2 } from '../Models/OwnerDTO2.model';

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



    UpdateOwner(owner: OwnerDTO2): Observable<any> {
        return this.http.put(`${this.BASE_URL}`, owner);
    }
}
