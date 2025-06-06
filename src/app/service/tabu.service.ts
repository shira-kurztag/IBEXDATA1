import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TabuDTO } from '../Models/TabuDTO.model';

@Injectable({
  providedIn: 'root'
})
export class TabuService {

   constructor() { }
  
    BASE_URL = '  https://localhost:5178/api/Tabu';
  
    http: HttpClient = inject(HttpClient);
  
  
    GetTabuByApartmentId(apartmentId: number): Observable<TabuDTO> {
      // קריאה לשרת לקבלת רשימת הדיירים
      console.log("hhh"+apartmentId);
      
      return this.http.get<TabuDTO>(`${this.BASE_URL}/GetTabuByApartmentId/${apartmentId}`);
    }
    UpdateTabu(tabu: TabuDTO): Observable<TabuDTO> {
    // נניח שיש לך API בנתיב /api/tabu שמעדכן טאבו לפי tabuId
    return this.http.put<TabuDTO>(`${this.BASE_URL}`, tabu);
  }
}
