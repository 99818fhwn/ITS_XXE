import { TestBed } from '@angular/core/testing';

import { UserEditService } from './user-edit.service';

describe('UserEditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserEditService = TestBed.get(UserEditService);
    expect(service).toBeTruthy();
  });
});
