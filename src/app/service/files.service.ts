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

  GetFile(uniqId: string): Observable<Magardoc[]> {
    return this.https.get<Magardoc[]>(`${this.BASE_URL}/GetUniqId/${uniqId}`)
  }

  DeleteFile(id: number): Observable<void> { // שינוי סוג ההחזרה ל-void
    return this.https.delete<void>(`${this.BASE_URL}/${id}`);
  }


  UpdateFile(id: number, magardoc: Magardoc): Observable<Magardoc>{
    const url = `${this.BASE_URL}/${id}`;
    console.log("url",url);
    return this.https.put<Magardoc>(url, magardoc);
  }

  // downloadFile(fileName: string): void {
  //   // URL של ה-API בשרת
  //   const downloadUrl = `https://your-server.com/api/files/download?fileName=${encodeURIComponent(fileName)}`;
  
  //   // שליחת בקשה לשרת להורדה
  //   this.https.get(downloadUrl, { responseType: 'blob' }).subscribe({
  //     next: (response: Blob) => {
  //       // יצירת Blob URL
  //       const blob = new Blob([response], { type: response.type });
  //       const link = document.createElement('a');
  //       link.href = window.URL.createObjectURL(blob);
  //       link.download = fileName; // שם הקובץ שיופיע למשתמש
  //       link.click(); // הורדה בפועל
  //       console.log(`הקובץ ${fileName} הורד בהצלחה!`);
  //     },
  //     error: (err) => {
  //       console.error('שגיאה בהורדת הקובץ:', err);
  //     }
  //   });
  // }

   
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
