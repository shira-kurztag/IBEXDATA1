import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MortagegesTypes } from '../Models/MortagegesTypes.model';
import { CurrencyType } from '../Models/CurrencyType.model';
import { MortagegeLevels } from '../Models/MortagegeLevels.model';

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
}