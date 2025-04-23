import { LinkagesapartmentDTO } from "./LinkagesApartmentDTO.model";

export class ApartmentDTO {
  apartmentId: number=0;
  buildingId: number=0;
  apartmentNumberByContract: number=0;
  apartmentStatus: number=0;
  floor?: number | null;
  apartmentSurfaceByContract?: number | null;
  apartmentNumberByAddress?: number | null;
  isCompanyHasCompletedCommitments: boolean=false;
  isGivenPossessionOfTheApartment: boolean=false;
  isProducedLease: boolean=false;
  isDetachedApartment?: boolean | null;
  linkagesApartments: LinkagesapartmentDTO[]=[];
}