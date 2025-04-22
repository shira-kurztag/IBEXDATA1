import { Data } from "@angular/router";

export class TenantDTO {
    LastName?: string
    FirstName?: string
    TenantIdentity?: string
    IdentityType?: number;//צריך להמיר הממספר לכיתוב(פעיל..) בשרת
    TenantStatus?:number;
    IdFileName?: string;
    IdentityFromCountry?: string;
    USName?: string;
    PreviousTenantId?: number;
    IdentityTypePrevious?: number;
    TenantIdentityPrevious?: string;
    OtherPrevious?: string;
    IsSignatureByPowerOfAttorney?: boolean;
    PowerOfAttorneyId?: string;
    LastNamePower?: string;
    FirstNamePower?: string;
    IdFileNamePower?: string;
    PowerOfAttorneyType?: number
    FromDate?: Data
    FileName?: string;
    Address?: string;
    NumberPhone?: string;
    NumberPhone2?: string;
    PartAsset?:number;
    ApartmentId?:number;


}