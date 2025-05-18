export class Project {
  projectId: number = 0;
  projectStatus: number = 0;
  contractingCompanyId: number = 0;
  projectName: string = "";
  city: string = "";
  neighborhood: string = "";
  isPurchaseInTender!: boolean;
  dateWinningTender: string = ""; // שינוי מ-Date ל-string
  isContractDevelopment!: boolean;
  contractDevelopmentFile: string = "";
  numberLease: string = "";
  developmentPeriodEndDate: string = ""; // שינוי מ-Date ל-string
  isDiscounted!: boolean;
  isPurchaseTaxPaymentConfirmation!: boolean;
  purchaseTaxPaymentConfirmationFile: string = "";
  isAppreciationTaxPaymentConfirmation: boolean = false;
  appreciationTaxPaymentConfirmationFile: string = "";
  isSalesTaxPaymentConfirmation: boolean = false;
  salesTaxPaymentConfirmationFile: string = "";
  powerOfAttorneyToLawyerFile: string = "";
  lendingBank: number = 0;
  isPerselasia: boolean = false;
  fullAssetIdentificationBeforePerselasia: string = "";
  anotherIdentification: string = "";
  perselasiaFile: string = "";
  fullAssetIdentificationAfterPerselasia: string = "";
  bloc?: number;
  smooth?: number;
  isTookJointListingExpenses!: boolean;
  principalAmount: number = 0;
  collectionExpensesFrom1: string = ""; // שינוי מ-Date ל-string
  collectionAmount1: number = 0;
  collectionExpensesFrom2: string = ""; // שינוי מ-Date ל-string
  collectionAmount2: number = 0;
  collectionExpensesFrom3: string = ""; // שינוי מ-Date ל-string
  collectionAmount3: number = 0;
  insertDate: string = ""; // שינוי מ-Date ל-string
  updateDate: string = ""; // שינוי מ-Date ל-string
  isRishumBaitMeshutafStarted: boolean = false;
  isPrepareWarningComment: boolean = false;
  isRishumBaitMeshutaf: boolean = false;
  hachiraContractFile: string = "";
  note: string = "";
  hachiraContractEndDate: string = ""; // שינוי מ-Date ל-string
  landOwnershipId: number = 0;
  mechozReshutMass: string = "";
  mechozReshutMassAddress: string = "";
  mechozMenaelMekarkaey: string = "";
  mechozMenaelMekarkaeyAddress: string = "";
  mechozTabu: string = "";
  mechozTabuAddress: string = "";
  isDiscountedHachira: boolean = false;
  numberHakiraContract: string = "";
  projectDrawingFile: string = "";
  isHachiraContract: boolean = false;
  smothArea?: number;
  isStartingRishumBaitMeshutaf:boolean=false;
  // שדות עזר להצגה בטופס
  dateWinningTenderDisplay?: Date | null;
  developmentPeriodEndDateDisplay?: Date | null;
  collectionExpensesFrom1Display?: Date | null;
  collectionExpensesFrom2Display?: Date | null;
  collectionExpensesFrom3Display?: Date | null;
  hachiraContractEndDateDisplay?: Date | null;

  constructor() {
    const today = new Date().toISOString().split('T')[0];
    this.insertDate = today;
    this.updateDate = today;
  }
}