import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { patientGuardGuard } from './patient-guard.guard';

describe('patientGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => patientGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
