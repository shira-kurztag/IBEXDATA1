import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tenant } from '../Models/Tenant.model';
import { TenantDTO } from '../Models/TenantDTO.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  constructor() { }

  BASE_URL = '  https://localhost:5178/api/Tenant';


  http: HttpClient = inject(HttpClient);

  getTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(this.BASE_URL);
  }
  getTenantById(id: number): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.BASE_URL}/GetTenantById/${id}`);
  }
  
  addTenants(tenants: TenantDTO[]): Observable<void> {
    console.log("Sending tenants:", tenants);
    return this.http.post<void>(this.BASE_URL, tenants);
  }

  GetPartAssetByOwnerTenants(id: number): Observable<number> {
    return this.http.get<number>(`${this.BASE_URL}/GetPartAssetByOwnerTenants/${id}`);
  }
  GetPartAssetApartmentID(ApartmentID:number):Observable<number>{
   
    
    return this.http.get<number>(`${this.BASE_URL}/GetPartAssetApartmentID/${ApartmentID}`)
  }
}
