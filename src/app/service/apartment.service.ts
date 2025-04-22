import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {

  constructor() { }

  BASE_URL = 'https://localhost:5178/api/Apartment';

  http: HttpClient = inject(HttpClient);

  GetPartAssetApartmentID(ApartmentID: number): Observable<number> {
    console.log("pp" + ApartmentID);

    return this.http.get<number>(`${this.BASE_URL}/GetPartAssetApartmenID/${ApartmentID}`).pipe(
        tap(response => {
            console.log("Response from server:", response);
        })
    );
 }
 
}
