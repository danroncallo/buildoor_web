import { TestBed, inject } from '@angular/core/testing';

import { UsesService } from './uses.service';

describe('UsesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsesService]
    });
  });

  it('should be created', inject([UsesService], (service: UsesService) => {
    expect(service).toBeTruthy();
  }));
});
