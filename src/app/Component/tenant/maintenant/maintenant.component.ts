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
  tenant!: any;
  partAsset: number = 0;
  @Input() tenantId!: number;
  constructor(private route: ActivatedRoute, private router: Router) { }
  srvTenant: TenantService = inject(TenantService);

  ngOnInit(): void {
    this.tenantId = 9805;///שלחתי כאן זמנית id ספציפי יש לקבל מקומפוננטה אב
    // this.tenantId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.tenantId);
    this.loadContractor();
    this.GetPartAssetByOwnerTenants()
  }

  loadContractor() {
    this.srvTenant.getTenantById(this.tenantId).subscribe((tenant: any) => {
      if (tenant) {
        this.tenant = tenant;
      } else {
        console.error('Contractor not found');
      }
    });
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

  GetPartAssetByOwnerTenants(): void {
    this.srvTenant.GetPartAssetByOwnerTenants(this.tenantId).subscribe((PartAsset: any) => {
      this.partAsset = PartAsset;
    })
  }
}


