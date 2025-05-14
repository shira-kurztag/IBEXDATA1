import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Bank } from '../Models/Bank.model';
import { BankNamesDTO } from '../Models/BankNamesDTO.model';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  
  BASE_URL = 'https://localhost:5178/api/Bank';

  https: HttpClient = inject(HttpClient);

  constructor() {}

  GetNames(): Observable<BankNamesDTO[]> {
    console.log(`${this.BASE_URL}/GetNames`);
    return this.https.get<BankNamesDTO[]>(`${this.BASE_URL}/GetNames`);
  }

  GetAll(): Observable<Bank[]> {
      return this.https.get<Bank[]>(`${this.BASE_URL}`);
  }

  getBanks(): Observable<Bank[]> {
    return this.https.get<Bank[]>(`${this.BASE_URL}/GetBanks`);
  }

  deleteBank(id: number): Observable<void> { 
    return this.https.delete<void>(`${this.BASE_URL}/${id}`);
  }

  updateBank(bankId: number, bankText: string): Observable<Bank[]> {
    return this.https.put<Bank[]>(`${this.BASE_URL}/${bankId}`, { bankText });
  }

  addBank(item: Bank): Observable<Bank[]> {
  
    return this.https.post<Bank[]>(this.BASE_URL, item);
  }
  // https://localhost:5178/api/Bank/GetBankById/74
  GetBankById(bankId: number): Observable<Bank> {
    return this.https.get<Bank>(`${this.BASE_URL}/GetBankById/${bankId}`);
}



}
  



