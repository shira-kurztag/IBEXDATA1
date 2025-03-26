import { TestBed } from '@angular/core/testing';

import { MortagegeService } from './mortagege.service';

describe('MortagegeService', () => {
  let service: MortagegeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MortagegeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
