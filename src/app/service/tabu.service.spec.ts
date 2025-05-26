import { TestBed } from '@angular/core/testing';

import { TabuService } from './tabu.service';

describe('TabuService', () => {
  let service: TabuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
