import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tenant } from '../Models/Tenant.model';
import { TenantForm } from '../Models/TenantForm.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  constructor() { }

  BASE_URL = 'https://localhost:5178/api/Tenant';

  http: HttpClient = inject(HttpClient);

  getTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(this.BASE_URL);
  }
  getTenantById(id: number): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.BASE_URL}/GetTenantById/${id}`);
  }

  addTenants(tenantsForm: TenantForm[]): Observable<void> {
    return this.http.post<void>(this.BASE_URL, tenantsForm);
  }

  GetPartAssetByOwnerTenants(id: number): Observable<number> {
    return this.http.get<number>(`${this.BASE_URL}/GetPartAssetByOwnerTenants/${id}`);
  }
}
