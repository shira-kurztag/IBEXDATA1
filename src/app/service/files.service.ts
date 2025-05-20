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
 
 
  UpdateFile(id: number, magardoc: Magardoc): Observable<Magardoc> {
    const url = `${this.BASE_URL}/${id}`;
    console.log("url", url);
    return this.https.put<Magardoc>(url, magardoc);
  }
 
  // פונקציה לשליחת בקשת הורדה לשרת
  downloadFile(fileName: string): Observable<Blob> {
    const url = `${this.BASE_URL}/download?fileName=${encodeURIComponent(fileName)}`;
    console.log('Downloading file from URL:', url); // בדיקה
    return this.https.get(url, { responseType: 'blob' });
  }
}
 
 