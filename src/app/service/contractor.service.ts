import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Contractor } from '../Models/Contractor.model';

@Injectable({
  providedIn: 'root',

})
export class ContractorService {

  BASE_URL = 'https://localhost:5178/api/Contractor';

  http: HttpClient = inject(HttpClient);
  getContractors(): Observable<Contractor[]> {
    return this.http.get<Contractor[]>(this.BASE_URL);
  }

  getContractorById(id: number): Observable<Contractor> {
    return this.http.get<Contractor>(`${this.BASE_URL}/GetContractorById/${id}`);
  }

  updateContractor(updatedContractor: Contractor): Observable<any> {
    return this.http.put<any>(this.BASE_URL, updatedContractor);
  }

  addContractor(contractor: Contractor): Observable<void> {
    return this.http.post<any>(this.BASE_URL, contractor);
  }

  isIsraeliIdNumber(id: string | number): boolean {
    let idStr = String(id).trim();
    if (idStr.length > 9 || isNaN(Number(idStr))) return false;

    idStr = idStr.padStart(9, '0'); // השלמת מספרים ל-9 ספרות
    const isValid = Array.from(idStr, Number).reduce((counter, digit, i) => {
      const step = digit * ((i % 2) + 1);
      return counter + (step > 9 ? step - 9 : step);
    }, 0) % 10 === 0;

    return isValid;
  }

}
