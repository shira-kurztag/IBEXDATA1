import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MortagegesTypes } from '../Models/MortagegesTypes.model';
import { CurrencyType } from '../Models/CurrencyType.model';
import { MortagegeLevels } from '../Models/MortagegeLevels.model';
import { Owner } from '../Models/Owner.model';
import { Tenant } from '../Models/Tenant.model';
import { Mortagege } from '../Models/Mortagege.model';
import { TypeMessage } from '../Models/TypeMessage.model';
import { BankCertificate } from '../Models/BankCertificate.model';
import { MortagegeDTO } from '../Models/MortagegeDTO.model';

@Injectable({
  providedIn: 'root'
})

export class MortagegeService {
 
  BASE_URL = 'https://localhost:5178/api/Mortagege';

  http: HttpClient = inject(HttpClient);

  GetAllMortagegesTypes(): Observable<MortagegesTypes[]> {
    return this.http.get<MortagegesTypes[]>(this.BASE_URL);
  }

  GetAllCurrencyTypes(): Observable<CurrencyType[]> {
    return this.http.get<CurrencyType[]>(this.BASE_URL+'/GetAllCurrencyTypes');
  }

  GetAllMortagegeLevels(): Observable<MortagegeLevels[]> {
    return this.http.get<MortagegeLevels[]>(this.BASE_URL+'/GetAllMortagegeLevels');
  }

 CreateMortagege(mortagege:Mortagege):Observable<any>{
  return this.http.post<any>(this.BASE_URL,mortagege);
 }

savedFullMortagege(mortagege: Mortagege, id: number): Observable<any> {
  return this.http.put<any>(`${this.BASE_URL}/SaveFullMortagege/${id}`, mortagege);
}

GetAllTypeMessages(): Observable<TypeMessage[]> {
  return this.http.get<TypeMessage[]>(this.BASE_URL+'/GetAllTypeMessages');
}


hasMortgageInProcess(apartmentId: number): Observable<boolean> {
  return this.http.get<boolean>(`${this.BASE_URL}/HasMortgageInProcess/${apartmentId}`);}


  createBankCertificate(bankCertificate: BankCertificate): Observable<number> {
    return this.http.post<number>(this.BASE_URL+'/createBankCertificate', bankCertificate);
        }


    updateBankCertificates(bankCertificates: BankCertificate[],MortagegeId:number,listIdOwnerOfmort:number[]): Observable<any> {
      return this.http.put<any>(`${this.BASE_URL}/UpdateBankCertificates/${MortagegeId}/${listIdOwnerOfmort}`, bankCertificates);
    }

    
    GetAllMortgageBanksByApartment(apartmentId: number): Observable<number[]> {
      return this.http.get<number[]>(`${this.BASE_URL}/GetAllMortgageBanksByApartment/${apartmentId}`);
    }

    // https://localhost:5178/api/Mortagege/GetAllIdMortgageByTeant/9803
  // Function to get all mortgages by tenant ID
  getAllIdMortgageByTenant(tenantId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.BASE_URL}/GetAllIdMortgageByTeant/${tenantId}`);
  }

  // Function to get a mortgage by ID
  
    // https://localhost:5178/api/Mortagege/GetMortgageById/9803
     getMortgageById(mortgageId: number): Observable<MortagegeDTO> {

    return this.http.get<MortagegeDTO>(`${this.BASE_URL}/GetMortgageById/${mortgageId}`);
  }
}