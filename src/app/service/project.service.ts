import { inject, Injectable } from '@angular/core';
import { Project } from '../Models/Project.model';
import { Observable } from 'rxjs';
import { ProjectDTO } from '../Models/ProjectDTO.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProjectCreateDTO } from '../Models/ProjectCreateDTO.model';
import { Contractor } from '../Models/Contractor.model';
import { LandOwnerShip } from '../Models/LandOwnerShip.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  BASE_URL = 'https://localhost:5178/api/Project'
  https: HttpClient = inject(HttpClient);

  constructor() { }

  GetAll(): Observable<Contractor[]> {
    console.log(`${this.BASE_URL}`);
    return this.https.get<Contractor[]>(`${this.BASE_URL}`);
  }

  AddProject(projectDto: Project): Observable<Project> {
    console.log('Sending project data:', projectDto);
    return this.https.post<Project>(this.BASE_URL, projectDto);
  }

  GetCompanyById(id: number): Observable<Contractor> {
    console.log(`${this.BASE_URL}/GetCompanyById?id=${id}`)
    return this.https.get<Contractor>(`${this.BASE_URL}/GetCompanyById?id=${id}`)
  }

  getProjectByName(projectName: string): Observable<any> {
    return this.https.get(`${this.BASE_URL}/byname/${projectName}`);
  }

  Update(id: number, project: Project): Observable<Project> {
    const url = `${this.BASE_URL}/${id}`;
    console.log("projectupdate", project);

    return this.https.put<Project>(url, project);
  }

  GetProjecctByContractor(id: number): Observable<Project[]> {
    console.log(`${this.BASE_URL}/GetProjecctByContractor?id=${id}`)
    return this.https.get<Project[]>(`${this.BASE_URL}/GetProjecctByContractor?id=${id}`)
  }

  GetLandOwnerShip(): Observable<LandOwnerShip[]> {
    console.log(`${this.BASE_URL}`);
    return this.https.get<LandOwnerShip[]>(`${this.BASE_URL}/GetLandOwnerShip`);
  }


}
// import { Injectable } from '@angular/core';
// import { Project } from '../Models/Project.model';
// import { Observable } from 'rxjs';
// import { ProjectDTO } from '../Models/ProjectDTO.model';
// import { HttpClient } from '@angular/common/http';
// import { ProjectCreateDTO } from '../Models/ProjectCreateDTO.model';
// import { Contractor } from '../Models/Contractor.model';
// import { LandOwnerShip } from '../Models/LandOwnerShip.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProjectService {

//   BASE_URL = 'https://localhost:5178/api/Project';

//   constructor(private http: HttpClient) { }

//   GetAll(): Observable<Contractor[]> {
//     return this.http.get<Contractor[]>(`${this.BASE_URL}`);
//   }

//   AddProject(projectDto: Project): Observable<Project> {
//     return this.http.post<Project>(this.BASE_URL, projectDto);
//   }

//   GetCompanyById(id: number): Observable<Contractor> {
//     return this.http.get<Contractor>(`${this.BASE_URL}/GetCompanyById?id=${id}`);
//   }

//   getProjectByName(projectName: string): Observable<any> {
//     return this.http.get(`${this.BASE_URL}/byname/${projectName}`);
//   }

//   Update(id: number, project: Project): Observable<Project> {
//     return this.http.put<Project>(`${this.BASE_URL}/${id}`, project);
//   }

//   GetProjecctByContractor(id: number): Observable<Project[]> {
//     return this.http.get<Project[]>(`${this.BASE_URL}/GetProjecctByContractor?id=${id}`);
//   }

//   GetLandOwnerShip(): Observable<LandOwnerShip[]> {
//     return this.http.get<LandOwnerShip[]>(`${this.BASE_URL}/GetLandOwnerShip`);
//   }
// }