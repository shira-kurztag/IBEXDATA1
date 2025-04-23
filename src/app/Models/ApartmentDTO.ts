import { LinkagesApartmentDTO } from "./LinkagesApartmentDTO";

export class ApartmentDTO{
    
    apartmentId:number=0;
   buildingId:number=0;
    apartmentNumberByContract:number=0;
   apartmentStatus:number=0;
   floor:number=0;
    apartmentSurfaceByContract:number=0;
    apartmentNumberByAddress:number=0;
    isCompanyHasCompletedCommitments:boolean=false;
    isGivenPossessionOfTheApartment:boolean=false;
    isProducedLease:boolean=false;
    isDetachedApartment:boolean=false;
    linkagesApartments: LinkagesApartmentDTO[]=[];
}