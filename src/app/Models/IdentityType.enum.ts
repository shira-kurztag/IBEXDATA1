export enum IdentityType {
    IDCard = 1,
   Passport  = 2,
    RegistrationNumber = 3
}
export function getIdentityTypeString(type: IdentityType): string {
    switch (type) {
        case IdentityType.Passport:
            return 'דרכון';
        case IdentityType.IDCard:
            return 'ת.ז.';
        case IdentityType.RegistrationNumber:
            return 'מ.ר.';
        default:
            return '';
    }
}