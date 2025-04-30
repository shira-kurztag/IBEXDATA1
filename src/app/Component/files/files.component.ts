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
  DocId: number = 0;
  DocId2: number = 0;
  isProcessingFiles: boolean = false; // דגל לניהול עיבוד הקבצים
  lastProcessedLabel: string | null = null; // מזהה לשינוי ב-labelText
  debounceTimeout: any = null; // מנגנון debounce

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
  @Output() nameDocGenerated = new EventEmitter<string>(); // Output להעברת ה-nameDoc

  constructor(private fileService: FilesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges triggered:', changes);

    // בדיקה אם labelText השתנה
    if (changes['labelText'] && changes['labelText'].currentValue) {
      const newLabelText = changes['labelText'].currentValue;

      // מניעת קריאות כפולות על אותו labelText
      if (this.lastProcessedLabel === newLabelText) {
        console.log('Skipping duplicate labelText processing:', newLabelText);
        return;
      }

      // עדכון מזהה השינוי
      this.lastProcessedLabel = newLabelText;

      // מנגנון debounce למניעת קריאות מרובות
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.processLabelText(newLabelText);
      }, 300); // עיכוב של 300ms
    }
  }

  private processLabelText(labelText: string): void {
    console.log('Processing labelText:', labelText);

    // מניעת עיבודים מקבילים
    if (this.isProcessingFiles) {
      console.log('Processing is already in progress, skipping...');
      return;
    }

    this.isProcessingFiles = true;

    this.getdocId(labelText)
      .then(() => {
        console.log('Calling addFiles after successful getdocId...');
        this.addFiles(this.fileList);
      })
      .finally(() => {
        this.isProcessingFiles = false; // איפוס הדגל לאחר סיום
      });
  }

  addFiles(fileList: FileList): void {
    if (!fileList || fileList.length === 0) {
      console.error('No files selected.');
      return;
    }

    if (!this.DocId2) {
      console.error('DocId is not set. Cannot proceed with addFiles.');
      return;
    }

    console.log('Starting to process files:', fileList);

    const uniqId = this.generateUniqueId();
    this.nameDocGenerated.emit(this.labelText);
    this.uniqIdGenerated.emit(uniqId);

    const formData = new FormData();

  Array.from(fileList).forEach(file => {
  //const uniqId = this.generateUniqueId(); // יצירת uniqId עבור כל קובץ
  const magardoc = new Magardoc();
  magardoc.uniqId = uniqId;
  magardoc.logId = this.generateGuidLogId();
  magardoc.fileNameShow = file.name;
  magardoc.docId = this.DocId2;
  magardoc.contractorCode = this.contractorCode ?? 0;
  magardoc.projectCode = this.projectCode ?? 0;
  magardoc.date = this.formatDate(new Date());
  magardoc.buildingCode = this.buildingCode ?? 0;
  magardoc.apartmentCode = this.apartmentCode ?? 0;
  magardoc.tenantCode = this.tenantCode ?? 0;

  const formData = new FormData();
  formData.append('file', file); // שדה file
  formData.append('magardocJson', JSON.stringify(magardoc)); // שדה magardocJson

  this.fileService.AddFile(formData).subscribe({
    next: (response) => {
      console.log('File uploaded successfully:', response);
    },
    error: (err) => {
      console.error('Error uploading file:', err);
    },
  });
});
  }

  getdocId(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Fetching DocId for:', name);
      this.fileService.GetdocId(name).subscribe({
        next: (res) => {
          this.DocId = res;
          this.DocId2 = res.code;
          console.log('DocId fetched successfully:', res);
          resolve(); // פתרון ה-Promise לאחר קבלת הערך
        },
        error: (err) => {
          console.error('Error fetching DocId:', err);
          reject(err); // דחיית ה-Promise במקרה של שגיאה
        },
      });
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