import { TestBed } from '@angular/core/testing';

import { BiImplementationService } from './bi-implementation.service';

describe('BiImplementationService', () => {
  let service: BiImplementationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiImplementationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
