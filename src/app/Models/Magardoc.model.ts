export class Magardoc {
    id?: number = 0;
    uniqId!: string;
    logId!: string;
    fileNameShow!: string;
    date: string = ""; // שינוי מטיפוס Date לטיפוס string
    docId!: number;
    contractorCode?: number;
    projectCode?: number;
    buildingCode?: number;
    apartmentCode?: number;
    tenantCode?: number;
}