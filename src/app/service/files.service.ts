import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Magardoc } from '../Models/Magardoc.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  
  BASE_URL = 'https://localhost:5178/api/Files'
  https: HttpClient = inject(HttpClient);

  constructor() { }

  AddFile(file: Magardoc): Observable<Magardoc> {
    console.log('Sending Magardocs data:', Magardoc);
    return this.https.post<Magardoc>(this.BASE_URL, file);
  }

}
