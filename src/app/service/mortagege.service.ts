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
  console.log(mortagege);
  return this.http.post<any>(this.BASE_URL,mortagege);
 }

savedFullMortagege(mortagege: Mortagege, id: number): Observable<any> {
  console.log("Received id:", id);
  console.log("Received mortagege object:", mortagege);
  return this.http.put<any>(`${this.BASE_URL}/SaveFullMortagege/${id}`, mortagege);
}

GetAllTypeMessages(): Observable<TypeMessage[]> {
  return this.http.get<TypeMessage[]>(this.BASE_URL+'/GetAllTypeMessages');
}

}