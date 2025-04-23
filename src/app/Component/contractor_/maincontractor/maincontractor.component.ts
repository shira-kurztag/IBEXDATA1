import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Component, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ContractorService } from '../../../service/contractor.service';
import { ProjectService } from '../../../service/project.service';
import { Contractor } from '../../../Models/Contractor.model';
import { Project } from '../../../Models/Project.model';
import { catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms'; // ייבוא FormsModule



@Component({
  selector: 'app-contractor',
  imports: [ CommonModule, ReactiveFormsModule, CardModule, ButtonModule, InputTextModule, HttpClientModule, AutoComplete,FormsModule ],  
  templateUrl: './maincontractor.component.html',
  styleUrl: './maincontractor.component.css',
  providers: [ContractorService, ProjectService]
})
export class MaincontractorComponent implements OnInit {
  @Input() contractorId!: number;
  contractor!: any;
  editMode: boolean = false;
  contractorForm!: FormGroup;
  flagList: boolean = false
  flagListDelete: boolean = false

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router) { }
  srvContractor: ContractorService = inject(ContractorService);
  srvProject: ProjectService = inject(ProjectService);

  selectedProject: Contractor | null = null;
  filteredProjects: Project[] = []; // Type change to Contractors[]
  Projects: Project[] = [];
  ProjectsDelete: Project[] = [];
  ProjectsActive: Project[] = [];
  flagProject! : boolean
  projectName: string =""

  filterProject(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredProjects = this.Projects.filter(project =>
      project.projectName?.toLowerCase().includes(query)
    );
  }

  onSelectProject(event: any): void {
    this.selectedProject = event.value;
    if (this.selectedProject) {
      this.router.navigate(['/project', this.selectedProject.contractorId]);
    }
  }

  ngOnInit(): void {
    this.contractorId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadContractor();
    this.getAllProjects()
    this.getDeleteProjects()
    // this.srvProject.getProjectsByContractor(this.contractorId).subscribe(Projects => {
    //   this.Projects = Projects;
    // });
  }

  loadContractor() {
    this.srvContractor.getContractorById(this.contractorId).subscribe((contractor: any) => {

      if (contractor) {
        this.contractor = contractor;
        this.initializeForm();
        console.log("cotractor", this.contractor);
      } else {
        console.error('Contractor not found');
      }
    });
  }

  initializeForm() {
    this.contractorForm = this.fb.group({
      contractorName: [this.contractor?.contractorName, [Validators.pattern('^[a-zA-Zא-ת .()"-]+$')]],
      contractorIdentity: [this.contractor?.contractorIdentity, [Validators.pattern('^[0-9]+$')]],
      managementName: [this.contractor?.managementName, [Validators.pattern('^[a-zA-Zא-ת ]+$')]],
      managementId: [this.contractor?.managementId, [Validators.required, Validators.pattern('^[0-9]+$'), this.validateId.bind(this)]],
      address: [this.contractor?.address, [Validators.pattern('^[a-zA-Z0-9א-ת ]+$')]],
      certificateConsortium: [this.contractor?.certificateConsortium, [Validators.pattern('^[a-zA-Z0-9א-ת .-]+$')]],
      _50form: [this.contractor?._50form, [Validators.pattern('^[a-zA-Z0-9א-ת .-]+$')]]
    });
  }

  validateId(control: AbstractControl): ValidationErrors | null {
    const isValid = this.srvContractor.isIsraeliIdNumber(control.value);
    return isValid ? null : { invalidId: true };
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    console.log(this.editMode);

    if (!this.editMode) {
      this.initializeForm();
    }
  }

  onSave() {
    if (this.contractorForm.valid) {
      const updatedContractor: Contractor = {
        ...this.contractor,
        ...this.contractorForm.value
      };
      this.srvContractor.updateContractor(updatedContractor,).subscribe(() => {
        console.log(this.contractor._50form);

        this.contractor = updatedContractor;
        this.toggleEditMode();
      });
    }
  }

  addProject(){
    this.flagProject = true;
    this.router.navigate(['/project', this.contractor.contractorId,this.projectName,String(this.flagProject)]);
  }

  getAllProjects(){
    this.srvProject.GetProjecctByContractor(this.contractorId).pipe(
      catchError(error => {
        console.error('Error fetching Projects:', error);  // הדפס את השגיאה
        return of([]);  // החזר מערך ריק במקרה של שגיאה
      })
    ).subscribe((projects: Project[]) => {
      console.log('Projects', projects);
      this.Projects = projects;
      for (let i = 0; i < this.Projects.length; i++) {
        if (this.Projects[i].projectStatus == 1)
          this.ProjectsActive.push(this.Projects[i])
      }
      console.log('ProjectsActive', this.ProjectsActive);
    });
  }

  getDeleteProjects() {
    this.srvProject.GetProjecctByContractor(this.contractorId).pipe(
      catchError(error => {
        console.error('Error fetching Projects:', error);  // הדפס את השגיאה
        return of([]);  // החזר מערך ריק במקרה של שגיאה
      })
    ).subscribe((projects: Project[]) => {
      console.log('Projects', projects);
      this.Projects = projects;
      for (let i = 0; i < this.Projects.length; i++) {
        if (this.Projects[i].projectStatus == 0)
          this.ProjectsDelete.push(this.Projects[i])
      }
      console.log("ProjectsDelete", this.ProjectsDelete);

    });
  }

  onProjectSelect(event: Event) {
    const selectedProjectName = (event.target as HTMLSelectElement).value;
    this.getProject(selectedProjectName);
  }

  getProject(projectname: string) {
    this.projectName = projectname;
    this.flagProject = false;
    this.router.navigate(['/project', this.contractor.contractorId, this.projectName, String(this.flagProject)]);
  }
  projectList(){
    this.flagList = !this.flagList
  }

  projectDelete() {
    this.flagListDelete = !this.flagListDelete
  }

  onProjectChange() {
    this.flagProject = false;
    console.log("flagProject in contractor", this.flagProject);
    
    this.router.navigate(['/project', this.contractor.contractorId, this.chosedProject, String(this.flagProject)]);
    console.log(['/project', this.contractor.contractorId, this.chosedProject, String(this.flagProject)]);
  }
  
  addProject() {
    this.flagProject = true;
    this.router.navigate(['/project', this.contractor.contractorId, this.chosedProject, String(this.flagProject)]);
  }
  
//   onProjectChange() {
//     this.flagProject = false
//     console.log("flagProject in contractor",this.flagProject);
    
//     this.router.navigate(['/project', this.contractor.contractorId,this.chosedProject,this.flagProject]);
//     console.log(['/project', this.contractor.contractorId,this.chosedProject,this.flagProject]);
    
//  }

//  addProject() {
//   this.flagProject = true
//   this.router.navigate(['/project', this.contractor.contractorId,this.chosedProject,this.flagProject]);
// }
}

