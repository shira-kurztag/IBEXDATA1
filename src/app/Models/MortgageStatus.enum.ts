export enum MortgageStatus {
  InProcess = 1,
  Active = 2,
  Historic = 3,
}

export function getMortgageStatusString(type: MortgageStatus): string {
  switch (type) {
    case MortgageStatus.InProcess:
      return 'בתהליך';
    case MortgageStatus.Active:
      return 'פעיל';
    case MortgageStatus.Historic:
      return 'הסטורי';
    default:
      return '';
  }
}