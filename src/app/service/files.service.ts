import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Magardoc } from '../Models/Magardoc.model';
import { Observable } from 'rxjs';
import { TipeFile } from '../Models/TipeFile.model';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  BASE_URL = 'https://localhost:5178/api/Files'
  https: HttpClient = inject(HttpClient);

  constructor() { }

  AddFile(formData: FormData): Observable<any> {
    return this.https.post(this.BASE_URL, formData);
  }

  GetdocId(docName: string): Observable<any> {
    return this.https.get<TipeFile>(`${this.BASE_URL}/GetIdFile/${docName}`);
  }
  
  // AddFile(file: Magardoc): Observable<Magardoc> {
  //   console.log('Sending Magardocs data:', file);
  //   console.log("SDERDTYGOIUGKJ;LK';LK",this.BASE_URL, file);
  //   return this.https.post<Magardoc>(this.BASE_URL, file);
  // }

  // עדכון הפונקציה בשירות
  // AddFile(file: File, magardoc: Magardoc): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file); // הוספת הקובץ ל-FormData
  //   formData.append('magardoc', JSON.stringify(magardoc)); // הוספת הנתונים הנוספים

  //   return this.https.post(this.BASE_URL, formData); // שליחה לשרת
  // }


}
