import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Models/User.model';
import { AdminApproval } from '../Models/AdminApproval.model';

@Injectable({
  providedIn: 'root'
})
export class AdminApprovalService {

  constructor() { }

  BASE_URL_USER = 'https://localhost:5178/api/User';
  BASE_URL = 'https://localhost:5178/api/AdminApproval';
  http: HttpClient = inject(HttpClient);

  getAdmins(): Observable<User[]> {
    return this.http.get<User[]>(this.BASE_URL_USER+'/GetAllAdmin');
  }
  // https://localhost:5178/api/AdminApproval

   addAdminApproval(adminApproval: AdminApproval): Observable<void> {
      return this.http.post<any>(this.BASE_URL, adminApproval);
    }
    
}
