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

  GetOwnersByApartmentId(id:number): Observable<any[]> {

       return this.http.get<any[]>(`${this.BASE_URL}/GetOwnersByApartmentId/${id}`);
  }

  GetAllOwnersByTenants(tenants: number[]): Observable<Owner[]> {
    const tenantsArray = Array.isArray(tenants) ? tenants : [tenants];

    return this.http.post<Owner[]>(`${this.BASE_URL}/GetAllOwnersByTenants`, tenantsArray);
  }

 
}
