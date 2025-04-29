import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Magardoc } from '../../Models/Magardoc.model';
import { FilesService } from '../../service/files.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
  standalone: true
})
export class FilesComponent implements OnChanges {
  @Input() fileNameShow: string[] = []; // שמות הקבצים
  @Input() contractorCode?: number;
  @Input() projectCode?: number;
  @Output() uniqIdGenerated = new EventEmitter<string>(); // Output להעברת ה-UniqId

  constructor(private fileService: FilesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['fileNameShow'] &&
      changes['fileNameShow'].currentValue &&
      changes['fileNameShow'].currentValue.length > 0
    ) {
      console.log('FilesComponent detected change:', changes['fileNameShow'].currentValue);
      this.addFiles();
    }
  }

  addFiles() {
    if (this.fileNameShow.length === 0) {
      return;
    }
    // יצירת UniqId
    const uniqId = this.generateUniqueId();

    // שידור ה-UniqId לקומפוננטת האב
    this.uniqIdGenerated.emit(uniqId);

    // יצירת מסמכים
    this.fileNameShow.forEach((fileName) => {
      const magardoc = new Magardoc();
      magardoc.UniqId = uniqId;
      magardoc.LogId = this.generateGuidLogId();
      magardoc.FileNameShow = fileName;
      magardoc.ContractorCode = this.contractorCode;
      magardoc.ProjectCode = this.projectCode;

      this.fileService.AddFile(magardoc);
    });
  }

  private generateUniqueId(): string {
    return `${this.getRandomNumbers(6)}-${this.getTimestamp()}`;
  }

  private getRandomNumbers(length: number): string {
    let randomNumbers = '';
    for (let i = 0; i < length; i++) {
      randomNumbers += Math.floor(Math.random() * 10);
    }
    return randomNumbers;
  }

  private getTimestamp(): string {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  }

  private generateGuidLogId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}