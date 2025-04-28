
import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TenantService } from '../../../service/tenant.service';
import { getIdentityTypeString, IdentityType } from '../../../Models/IdentityType.enum';
import { getTenantStatusString, TenantStatus } from '../../../Models/TenantStatus.enum';


@Component({
  selector: 'app-tenant',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './maintenant.component.html',
  styleUrl: './maintenant.component.css',
  providers: [TenantService]
})
export class MainTenantComponent {

  tenant: any[] = []; // משתנה המייצג את רשימת הדיירים
  apartmentId!: number;
  partAsset: number = 0;
  Message: boolean = false;

  @Input() apartmentID!: number;
  constructor(private route: ActivatedRoute, private router: Router) { }
  srvTenant: TenantService = inject(TenantService);

  ngOnInit(): void {
    this.apartmentId = 9999;///שלחתי כאן זמנית id ספציפי יש לקבל מקומפוננטה אב
    // this.tenantId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.apartmentId);
    this.getTenants();
    // this.GetPartAssetByOwnerTenants()

  }
  MessagePartAsset() {
    for (let i = 0; i < this.tenant.length; i++) {
      this.partAsset += this.tenant[i].PartAsset
    }
    if (this.partAsset < 100) {
      this.Message = true
    }
  }
  getTenants() {
    this.srvTenant.GetTenantByApartment(this.apartmentId).subscribe((tenant: any) => {
      if (tenant) {
        this.tenant = tenant;
        this.MessagePartAsset()
        console.log(this.tenant);
      } else {
        console.error('TenantByApartment not found');
      }
    });
  }
  trackByTenantId(index: number, item: any): number {
    return item.id; // או כל מזהה ייחודי אחר
  }
  showOwnerDetails(): void {

    // Implement the logic to show owner details here
  }

  getIdentityTypeString(type: IdentityType): string {
    return getIdentityTypeString(type);
  }

  getTenantStatusString(status: TenantStatus): string {
    return getTenantStatusString(status);
  }

  // GetPartAssetByOwnerTenants(): void {
  //   this.srvTenant.GetPartAssetByOwnerTenants(this.tenantId).subscribe((PartAsset: any) => {
  //     this.partAsset = PartAsset;
  //   })
  // }

  edit() {

  }
}

