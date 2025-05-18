import { ApartmentDTO } from "./ApartmentDTO.model";
import { Project } from "./Project.model";
 
export class Building{
    buildingId: number | undefined;
    projectId?: number;
    buildingStatus?: number;
    buildingNumber?: string;
    floorsNumber?: number;
    isElevator: boolean | undefined;
    addressAndNumberOfMunicipal?: string;
    isBuildingPermit: boolean | undefined;
    buildingPermitFile?: string;
    is4Form: boolean | undefined;
    _4formFile?: string;
    isPerselasia: boolean | undefined;
    fullAssetIdentificationBeforePerselasia?: string;
    anotherIdentification?: string;
    perselasiaFile?: string;
    bloc?: number;
    smooth?: number;
    isTookJointListingExpenses: boolean | undefined;
    principalAmount?: number;
    collectionExpensesFrom1?: Date;
    collectionAmount1?: number;
    collectionExpensesFrom2?: Date;
    collectionAmount2?: number;
    collectionExpensesFrom3?: Date;
    collectionAmount3?: number;
    note?: string;
    noteStatus: boolean | undefined;
    insertDate: Date | undefined;
    updateDate?: Date;
    deleteReson?: string;
    noteEdit?: string;
    noteEditStatus?: boolean;
    noteApprovalRights?: string;
    noteEsitApprovalRights?: string;
    buildingDrawingFile?: string;
    parkingDrawingFile?: string;
    warehauseDrawingFile?: string;
    fullAssetIdentificationAfterPerselasia?: string;
    isStartingRishumBaitMeshutaf?: boolean;
    isPrepareWarningComment?: boolean;
    isRishumBaitMeshutaf?: boolean;
    smothArea?: number;
    apartments: ApartmentDTO[] = [];
    project?: Project;
 
 
}
 