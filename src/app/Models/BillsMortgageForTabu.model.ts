import { Bank } from "./Bank.model";
import { Tabu } from "./Tabu.model";

export  class BillsMortgageForTabu{
id!:number;
tabuId!:number;
sum?:number;
fromBank?:number;
isValid?:boolean=false;
suitableForLiabilities?:boolean=false;
isSign?:boolean=false;
fileName?:string;
notesAndExplanation?:string;
status!:number;
insertDate?:Date;
fromBankNavigation?:Bank[]=[];
tabu:Tabu[]=[];

}