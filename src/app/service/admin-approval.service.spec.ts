import { TestBed } from '@angular/core/testing';

import { AdminApprovalService } from './admin-approval.service';

describe('AdminApprovalService', () => {
  let service: AdminApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
