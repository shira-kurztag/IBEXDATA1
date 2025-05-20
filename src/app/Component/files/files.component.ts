import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Magardoc } from '../../Models/Magardoc.model';
import { FilesService } from '../../service/files.service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    CommonModule // כאן יש לוודא שהמודול מיובא
  ],
})
export class FilesComponent implements OnChanges {
  DocId: number = 0;
  DocId2: number = 0;
  private processingQueue: (() => Promise<void>)[] = []; // תור לעיבוד קריאות
  private isProcessing: boolean = false; // האם התור בעיבוד
  private uniqueIdForSession: string | null = null;
  fetchedFiles: Magardoc[] = []; // משתנה לשמירת הקבצים שהתקבלו
  flagGetFirst: boolean = true;
 
  @Input() fileNameShow: string[] = [];
  @Input() fileList!: FileList;
  @Input() nameDoc?: string;
  @Input() contractorCode?: number; // הגדרת contractorCode כ-Input
  @Input() IsGet: boolean = false;
  @Input() labelText: string = '';
  @Input() uniqId: any;
  @Output() uniqIdGenerated = new EventEmitter<string>();
  @Output() nameDocGenerated = new EventEmitter<string>();
  @Output() filesLoaded = new EventEmitter<Magardoc[]>();
  constructor(private fileService: FilesService) {}
  newLabelText:string = " "
  prevLabelText: string= ""
  selectedFileNames: string[] = []; // רשימת שמות הקבצים שנבחרו
  selectedFiles: FileList = new DataTransfer().files; // רשימת הקבצים בפועל
  documentName: string = "";
  currentFieldId: string = ''; // מזהה השדה הפעיל
  filesFromChild: Magardoc[] = []; // משתנה לקליטת הקבצים
  showTable: boolean = false;
  isFileUploaded: boolean = false; // משתנה לבקרת כפתור הפעולה הנוסף
  // נתונים לשדות חוזים
  public fileData: { [key: string]: { uniqId: string; nameDoc: string } } = {};
  ngOnInit() {
    // אם IsGet הוא false, טוענים את הקבצים
    if (!this.IsGet) {
      console.log("IsGet",this.IsGet);
      console.log("uniqId111111111",this.uniqId);
      this.GetFiles(this.uniqId);
    }
 
  }
 
 
async ngOnChanges(changes: SimpleChanges): Promise<void> {
  console.log('ngOnChanges triggered:', changes);
 
  if (changes['labelText'] && changes['labelText'].currentValue) {
     this.newLabelText = changes['labelText'].currentValue;
  }
}
 

  deleteFile(id: number): void {
    this.fileService.DeleteFile(id).subscribe({
      next: () => {
        // עדכון הרשימה לאחר מחיקה מוצלחת
        this.fetchedFiles = this.fetchedFiles.filter(file => file.id !== id);
        console.log(`הקובץ עם ID ${id} נמחק בהצלחה!`);
      },
      error: (err) => {
        console.error(`שגיאה במחיקת הקובץ עם ID ${id}:`, err);
      },
    });
  }
  downloadFile(file: any): void {
    // בדיקה אם הקלט הוא אובייקט ומכיל את fileNameShow
    if (typeof file === 'object' && file.fileNameShow) {
      const fileName = file.fileNameShow; // קבלת שם הקובץ
      this.fileService.downloadFile(fileName).subscribe({
        next: (response: Blob) => {
          const blob = new Blob([response], { type: response.type });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName; // שם הקובץ שיופיע למשתמש
          link.click();
          console.log(`הקובץ ${fileName} הורד בהצלחה!`);
        },
        error: (err) => {
          console.error('שגיאה בהורדת הקובץ:', err);
        },
      });
    } else {
      console.error('fileName must be a string. Received:', file);
    }
  }

 

  GetFiles(uniqId: string): Magardoc[] {
    if (!uniqId) {
      console.error('Unique ID is required to fetch files.');
      return [];
    }
    console.log('Calling GetFile with uniqId:', uniqId);
    this.fileService.GetFile(uniqId).subscribe(
      (files: Magardoc[]) => {
        console.log('Files fetched:', files);
        this.fetchedFiles = files; // שמירת הקבצים ב-fetchedFiles
        //this.filesLoaded.emit(files); // העברת הקבצים שהתקבלו באמצעות emit
        this.isFileUploaded = true
      },
      (error) => {
        console.error('Error fetching files:', error);
      }
    );
    return this.fetchedFiles
  }
  addFiles(): void {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      console.error('No files selected.');
      return;
    }
    // בדיקה אם כבר נוצר uniqueId ל-labelText הנוכחי
    if (!this.fileData[this.labelText]) {
      // יצירת uniqId ייחודי ושמירתו לפי שם הקובץ
      const uniqId = this.generateUniqueIdForLabel(this.labelText, this.contractorCode);
      this.fileData[this.labelText] = { uniqId, nameDoc: this.labelText };
    }
    const uniqId = this.fileData[this.labelText].uniqId; // שימוש ב-uniqId מהאובייקט
    this.nameDocGenerated.emit(this.newLabelText);
    this.uniqIdGenerated.emit(uniqId);
    Array.from(this.selectedFiles).forEach((file) => {
      if (!file || file.size === 0) {
        console.error('The file is empty or invalid:', file);
        alert('One of the selected files is empty or invalid.');
        return;
      }
      const magardoc = new Magardoc();
      magardoc.uniqId = uniqId;
      magardoc.logId = this.generateGuidLogId();
      magardoc.fileNameShow = file.name;
      magardoc.docId = this.DocId2;
      magardoc.date = this.formatDate(new Date());
      const formData = new FormData();
      formData.append('file', file);
      formData.append('magardocJson', JSON.stringify(magardoc));
      this.fileService.AddFile(formData).subscribe({
        next: (response) => {
          console.log('File uploaded successfully:', response);
          this.fetchedFiles = this.GetFiles(uniqId);
        },
        error: (err) => {
          console.error('Error uploading file:', err);
        },
      });
    });
  }
  // פונקציה ליצירת מזהה ייחודי המבוסס על שם הקובץ וקוד הקבלן
  private generateUniqueIdForLabel(labelText: string, contractorCode?: number): string {
    const contractorPrefix = contractorCode ? `${contractorCode}-` : '';
    return `${contractorPrefix}${labelText}-${this.getRandomNumbers(6)}-${this.getTimestamp()}`;
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
          this.addFiles()
        },
        error: (err) => {
          console.error('Error fetching DocId:', err);
          reject(err); // דחיית ה-Promise במקרה של שגיאה
        },
      });
    });
  }
  showT(): void {
    if (!this.showTable) {
      console.log("Toggled table visibility.");
      this.showTable = true;
    } else {
      this.showTable = false;
    }
  }
  onFilesLoaded(files: Magardoc[]): void {
    console.log('onFilesLoaded הופעלה עם הקבצים:', files);
    if (!files || files.length === 0) {
      console.error('No files received from FilesComponent.');
      this.filesFromChild = [];
      return;
    }
    this.filesFromChild = files; // שמירת הנתונים
    if(this.filesFromChild)
      this.isFileUploaded = true
    console.log('קבצים שהתקבלו filesFromChild:', JSON.stringify(this.filesFromChild, null, 2)); // תצוגת מבנה נתונים
  }
  onNameDocReceived(nameDoc: string): void {
    console.log('onNameDocReceived called with nameDoc:', nameDoc);
    if (this.currentFieldId && this.fileData[this.currentFieldId]) {
      this.fileData[this.currentFieldId].nameDoc = nameDoc;
      console.log(`${this.currentFieldId} nameDoc:`, nameDoc);
    }
  }
  onFilesSelected(event: Event, fieldId: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.currentFieldId = fieldId;
      this.selectedFiles = input.files;
      this.selectedFileNames = Array.from(input.files).map((file) => file.name);
      this.getdocId(this.newLabelText)
      console.log(`Selected files for ${fieldId}:`, this.selectedFileNames);
    } else {
      console.error('No files selected or invalid input.');
    }
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