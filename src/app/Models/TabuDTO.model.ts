export class TabuDTO {
    tabuId!: number;
    ownerId?: number;
    apartmentId?: number
    isMortgagePaid?: boolean;
    //public string? SubShare { get; set; }
    commonArea?: number  // dubel
    notarizedPoweReason?: string
    isPurchaseTax?: boolean
    isPurchaseTaxValid?: boolean
    isCapitalTax?: boolean
    isCapitalTaxValid?: boolean
    isApprovalNeededSaleTaxHas?: boolean;
    isApprovalNeededSaleTaxValid?: boolean
    isMunicipalityApproval?: boolean
    isMunicipalityApprovalValidity?: Date
    isTaxApprovedTransferRights?: boolean;
    isTaxApprovedTransferRightsSource?: boolean
    isTaxApprovedTransferRightsValid?: boolean
    isPartiesSigned?: boolean
    isSignedByMm?: boolean
    isMortgageBillReceived?: boolean
    fareName?: string
    fareAmount?: number //dubul
    bloc?: number
    smooth?: number
    smothArea?: number
}