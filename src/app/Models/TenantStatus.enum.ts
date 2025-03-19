export enum TenantStatus {
    Active = 1,
    inactive = 0,
}
export function getTenantStatusString(type: TenantStatus): string {
    switch (type) {
        case TenantStatus.Active:
            return 'פעיל';
        case TenantStatus.inactive:
            return 'לא פעיל';
                default:
            return '';
    }
    
}