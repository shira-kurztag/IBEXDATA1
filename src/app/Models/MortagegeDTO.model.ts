export class MortagegeDTO {
    mortagegeId?: number;
    mortagegesType?: string;
    toTheBank?: string;
    mortagegeStatus?: number;
    ///update
    amount?: number;
    teanantNames?: string[];
    isApprovalCompany: boolean = false;
    note?: string;
    amountType?: string;
    levelMortagege?: string;
    noteOrConditioning?: string; // האם יש הערות/התניות למשכנתא?
    dateCommitment?:Date;
}
