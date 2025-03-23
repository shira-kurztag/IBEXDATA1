import { LinkagesApartmentDTO } from "./LinkagesApartmentDTO";

export class ApartmentDTO{
    
    ApartmentId:number=0;
    BuildingId:number=0;
    ApartmentNumberByContract:number=0;
    ApartmentStatus:number=0;
    Floor:number=0;
    ApartmentSurfaceByContract:number=0;
    ApartmentNumberByAddress:number=0;
    IsCompanyHasCompletedCommitments:boolean=false;
    IsGivenPossessionOfTheApartment:boolean=false;
    IsProducedLease:boolean=false;
    IsDetachedApartment:boolean=false;
    LinkagesApartments: LinkagesApartmentDTO[]=[];
}