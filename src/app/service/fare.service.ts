import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fare } from '../Models/Fare.model';

@Injectable({
  providedIn: 'root',
})
export class FareService {

  BASE_URL = 'https://localhost:5178/api/Fare';

  constructor(private http: HttpClient) {}

  getFares(): Observable<Fare[]> {
    return this.http.get<Fare[]>(`${this.BASE_URL}/GetFare`);
  }

  deleteFare(id: number): Observable<Fare[]> {
    return this.http.delete<Fare[]>(`${this.BASE_URL}/${id}`);
  }

  addFare(item: Fare): Observable<Fare[]> {
    console.log('Sending POST request with item:', item); // Add a log to check if the function is called multiple times
    return this.http.post<Fare[]>(this.BASE_URL, item);
  }

  updateFareAmount(fareId: number, fareAmount: number): Observable<Fare[]> {
    return this.http.put<Fare[]>(`${this.BASE_URL}/${fareId}/amount`, { fareAmount });
  }
}