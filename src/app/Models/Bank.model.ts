import { BillsMortgageForTabu } from "./BillsMortgageForTabu.model";

export class Bank {
  bankId: number = 0;
  bankText?: string = "";
  insertDate!: Date;
  updateDate?: Date;
  bankStatus?: number;
  lastNameBank?: string;
  billsMortgageForTabus: BillsMortgageForTabu[] = [];
}