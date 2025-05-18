import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../Models/Comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  BASE_URL = 'https://localhost:5178/api/Comment'

  https: HttpClient = inject(HttpClient);

  constructor() { }

  AddComment(comment: Comment): Observable<Comment> {
    console.log('Sending Comment data:', comment);
    return this.https.post<Comment>(this.BASE_URL, comment);
  }

  GetComment(id: bigint): Observable<Comment> {
    return this.https.get<Comment>(`${this.BASE_URL}/GetComment/${id}`);
  }

  UpdateComment(id: bigint, comment: Comment) {
    
    const url = `${this.BASE_URL}/${id}`;
    console.log("service comment", url, comment);
    return this.https.put<Comment>(url, comment);
  }


  DeleteComment(id: bigint): Observable<void> {
    return this.https.delete<void>(`${this.BASE_URL}/${id}`);
  }



}


