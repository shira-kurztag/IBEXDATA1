import { Data } from "@angular/router";

export class TenantForm {
    LastName?: string
    FirstName?: string
    TenantIdentity?: string
    IdentityType?: number;//צריך להמיר הממספר לכיתוב(פעיל..) בשרת
    //חלק בנכסOWER
    TenantStatus?: string;
    IdFileName?: string;
    IdentityFromCountry?: string;
    USName?: string;
    previousTenantId?: number;
    IdentityType_previous?: number;
    TenantIdentity_previous?: string;
    OtherPrevious?: string;
    IsSignatureByPowerOfAttorney?: boolean;
    PowerOfAttorneyId?: string;
    LastName_Power?: string;
    FirstName_Power?: string;
    IdFileName_Power?: string;
    PowerOfAttorneyType?: number
    FromDate?: Data
    FileName?: string;
    Address?: string;
    NumberPhone?: string;
    NumberPhone2?: string;
}