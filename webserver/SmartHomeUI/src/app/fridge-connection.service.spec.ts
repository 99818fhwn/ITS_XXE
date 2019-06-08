import { TestBed } from '@angular/core/testing';

import { FridgeConnectionService } from './fridge-connection.service';

describe('FridgeConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FridgeConnectionService = TestBed.get(FridgeConnectionService);
    expect(service).toBeTruthy();
  });
});
