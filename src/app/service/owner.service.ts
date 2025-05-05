import { inject, Injectable } from '@angular/core';
import { Tenant } from '../Models/Tenant.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Owner } from '../Models/Owner.model';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
 http: HttpClient = inject(HttpClient);
  constructor() { }
  BASE_URL = 'https://localhost:5178/api/Owner';

  GetOwnersByApartmentId(id:number): Observable<Tenant[]> {

       return this.http.get<Tenant[]>(`${this.BASE_URL}/GetOwnersByApartmentId/${id}`);
  }
  // https://localhost:5178/api/Owner/GetAllOwnersByTenants
  GetAllOwnersByTenants(tenants: number[]): Observable<Owner[]> {
    return this.http.post<Owner[]>(`${this.BASE_URL}/GetAllOwnersByTenants`, tenants);
  }

}
