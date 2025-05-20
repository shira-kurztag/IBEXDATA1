export class BuildingDTO {
  buildingId!: number; // מזהה בניין
  projectId?: number; // מזהה פרויקט, שדה Nullable
  buildingStatus?: number; // סטטוס בניין, שדה Nullable
  buildingNumber?: string; // מספר בניין, שדה Nullable
  floorsNumber?: number; // מספר קומות, שדה Nullable
  isElevator: boolean = false; // האם יש מעלית (ברירת מחדל: false)
  addressAndNumberOfMunicipal?: string; // כתובת ומספר מוניציפלי
  isBuildingPermit: boolean = false; // האם יש היתר בניה (ברירת מחדל: false)
  is4Form: boolean = false; // האם יש טופס 4 (ברירת מחדל: false)
  fullAssetIdentificationBeforePerselasia?: string; // זיהוי נכס מלא לפני פרצלציה
  anotherIdentification?: string; // זיהוי נוסף
  isPerselasia: boolean = false; // האם יש פרצלציה (ברירת מחדל: false)
  fullAssetIdentificationAfterPerselasia?: string; // זיהוי נכס מלא אחרי פרצלציה
  bloc?: number; // גוש
  smooth?: number; // חלקה
  smothArea?: number; // שטח חלקה
  isStartingRishumBaitMeshutaf?: boolean; // האם התחיל רישום בית משותף
  isPrepareWarningComment?: boolean; // האם יש הכנת הערת אזהרה
  isRishumBaitMeshutaf?: boolean; // האם יש רישום בית משותף
  isTookJointListingExpenses: boolean = false; // האם נלקחו הוצאות רישום משותפות (ברירת מחדל: false)
  principalAmount?: number; // סכום עיקרי
  collectionExpensesFrom1?: string; // תאריך הוצאות גבייה 1 (שדה בתור string עבור Date)
  collectionAmount1?: number; // סכום גבייה 1
  collectionExpensesFrom2?: string; // תאריך הוצאות גבייה 2 (שדה בתור string עבור Date)
  collectionAmount2?: number; // סכום גבייה 2
  collectionExpensesFrom3?: string; // תאריך הוצאות גבייה 3 (שדה בתור string עבור Date)
  collectionAmount3?: number; // סכום גבייה 3
  buildingDrawingFile?: string; // קובץ שרטוט בניין
  note ?:string ;
}