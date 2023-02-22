import { TestBed } from '@angular/core/testing';

import { FiltersByDashboardService } from './filters-by-dashboard.service';

describe('FiltersByDashboardService', () => {
  let service: FiltersByDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiltersByDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
