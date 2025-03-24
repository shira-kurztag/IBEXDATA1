import { ApartmentDTO } from "./ApartmentDTO";
import { Project } from "./Project.model";

export class building{
    BuildingId: number | undefined;
    ProjectId?: number;
    BuildingStatus?: number;
    BuildingNumber?: string;
    FloorsNumber?: number;
    IsElevator: boolean | undefined;
    AddressAndNumberOfMunicipal?: string;
    IsBuildingPermit: boolean | undefined;
    BuildingPermitFile?: string;
    Is4Form: boolean | undefined;
    _4formFile?: string;
    IsPerselasia: boolean | undefined;
    FullAssetIdentificationBeforePerselasia?: string;
    AnotherIdentification?: string;
    PerselasiaFile?: string;
    Bloc?: number;
    Smooth?: number;
    IsTookJointListingExpenses: boolean | undefined;
    PrincipalAmount?: number;
    CollectionExpensesFrom1?: Date;
    CollectionAmount1?: number;
    CollectionExpensesFrom2?: Date;
    CollectionAmount2?: number;
    CollectionExpensesFrom3?: Date;
    CollectionAmount3?: number;
    Note?: string;
    NoteStatus: boolean | undefined;
    InsertDate: Date | undefined;
    UpdateDate?: Date;
    DeleteReson?: string;
    NoteEdit?: string;
    NoteEditStatus?: boolean;
    NoteApprovalRights?: string;
    NoteEsitApprovalRights?: string;
    BuildingDrawingFile?: string;
    ParkingDrawingFile?: string;
    WarehauseDrawingFile?: string;
    FullAssetIdentificationAfterPerselasia?: string;
    IsStartingRishumBaitMeshutaf?: boolean;
    IsPrepareWarningComment?: boolean;
    IsRishumBaitMeshutaf?: boolean;
    SmothArea?: number;
    Apartments: ApartmentDTO[] = [];
    Project?: Project;


}