import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Magardoc } from '../../Models/Magardoc.model';
import { FilesService } from '../../service/files.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: [],
  standalone: true
})
export class FilesComponent implements OnChanges {
  DocId: number = 0;

  @Input() fileNameShow: string[] = []; // שמות הקבצים
  @Input() contractorCode?: number; // קוד הקבלן
  @Input() projectCode?: number; // קוד הפרויקט
  @Input() buildingCode?: number;
  @Input() apartmentCode?: number;
  @Input() tenantCode?: number;
  @Input() fileList!: FileList; // רשימת הקבצים הנבחרים
  @Input() nameDoc?: string; // שם המסמך
  @Input() labelText: string = ''; // קבלת הטקסט של ה-label

  @Output() uniqIdGenerated = new EventEmitter<string>(); // Output להעברת ה-UniqId

  constructor(private fileService: FilesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['fileList'] &&
      changes['fileList'].currentValue &&
      changes['fileList'].currentValue.length > 0
    ) {
      this.addFiles(changes['fileList'].currentValue);
    }

    if (changes['labelText'] && changes['labelText'].currentValue) {
      this.nameDoc = changes['labelText'].currentValue; // הכנסת הטקסט מהאבא ל-nameDoc
    }

    if (this.nameDoc) {
      this.getdocId(this.nameDoc);
    }
  }

  addFiles(fileList: FileList): void {
    if (!fileList || fileList.length === 0) {
      console.error('No files selected.');
      return;
    }

    const uniqId = this.generateUniqueId();
    this.uniqIdGenerated.emit(uniqId);

    const formData = new FormData();
    Array.from(fileList).forEach(file => {
      if (!file || file.size === 0) {
        console.error('The file is empty or invalid:', file);
        alert('One of the selected files is empty or invalid.');
        return;
      }

      const magardoc = new Magardoc();
      magardoc.uniqId = uniqId;
      magardoc.logId = this.generateGuidLogId();
      magardoc.fileNameShow = file.name;
      magardoc.docId = this.DocId;
      magardoc.contractorCode = this.contractorCode ?? 0;
      magardoc.projectCode = this.projectCode ?? 0;
      magardoc.date = this.formatDate(new Date());
      magardoc.buildingCode = this.buildingCode ?? 0;
      magardoc.apartmentCode = this.apartmentCode ?? 0;
      magardoc.tenantCode = this.tenantCode ?? 0;

      formData.append('file', file); // שדה file
      formData.append('magardocJson', JSON.stringify(magardoc)); // שדה magardocJson
    });

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    this.fileService.AddFile(formData).subscribe({
      next: (response) => {
        console.log('Files uploaded successfully:', response);
      },
      error: (err) => {
        console.error('Error uploading files:', err);
      },
    });
  }

  getdocId(name: string): void {
    this.fileService.GetdocId(name).subscribe({
      next: (res) => {
        this.DocId = res;
      },
      error: (err) => {
        console.error('Error fetching DocId:', err);
      },
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private generateUniqueId(): string {
    return `${this.contractorCode}-${this.getRandomNumbers(6)}-${this.getTimestamp()}`;
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